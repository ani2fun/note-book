// mdbook preprocessor: renders ```d2 fenced blocks to inline SVG.
//
// Default renderer is the local `d2` CLI binary (d2lang.com). This was
// previously the public kroki.io HTTP API, but kroki's free tier is
// unreliable (frequent 504s and timeouts during burst renders) which
// produced visible "D2 render error" blocks on the deployed site. The
// kroki path is still available as a fallback when MDBOOK_D2_USE_KROKI=1.
//
// Protocol (mdbook): https://rust-lang.github.io/mdBook/for_developers/preprocessors.html
//   * Invoked as `mdbook-d2 supports <renderer>` to advertise renderer support.
//     Exit 0 = supported; non-zero = skipped.
//   * Invoked as `mdbook-d2` to preprocess: reads `[ctx, book]` JSON from stdin,
//     writes the modified `book` JSON to stdout.
//
// Performance: we render in three passes so renderer invocations happen
// concurrently across all chapters (rather than one block at a time).
//   1. Walk every chapter; replace each ```d2 fence with an HTML-comment
//      placeholder and collect the source into a flat Vec.
//   2. Render all sources in parallel (8 worker threads), with disk caching
//      keyed on the source content. Cache hits skip rendering entirely.
//   3. Walk every chapter again, substituting each placeholder with its SVG
//      (or a visible error block on render failure).

use std::collections::hash_map::DefaultHasher;
use std::env;
use std::fs;
use std::hash::{Hash, Hasher};
use std::io::{self, Read, Write};
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::sync::Arc;
use std::thread;
use std::time::{Duration, Instant};

use serde_json::Value;

const KROKI_URL_ENV: &str = "MDBOOK_D2_KROKI_URL";
const DEFAULT_KROKI_URL: &str = "https://kroki.io/d2/svg";
const USE_KROKI_ENV: &str = "MDBOOK_D2_USE_KROKI";
const D2_BIN_ENV: &str = "MDBOOK_D2_BIN";
const DEFAULT_D2_BIN: &str = "d2";
const CACHE_DIR_ENV: &str = "MDBOOK_D2_CACHE_DIR";
const DEFAULT_CACHE_DIR: &str = ".mdbook-d2-cache";
// Bumped on any change that would invalidate previously-cached SVGs (e.g.
// renderer switch with different output bytes, post-processing tweaks).
// Kept at 1 across the kroki -> local-d2 renderer switch because kroki
// uses d2 internally and the post-processed output is byte-equivalent in
// practice; existing on-disk caches stay valid.
const CACHE_VERSION: u32 = 1;
const FENCE_OPEN: &str = "```d2";
const FENCE_CLOSE: &str = "```";
const PLACEHOLDER_PREFIX: &str = "<!--MDBOOK_D2_BLOCK_";
const PLACEHOLDER_SUFFIX: &str = "-->";
const MAX_CONCURRENT: usize = 8;
// Public kroki occasionally returns 504/429/transient network errors during a
// large build burst. Retry with exponential backoff before giving up.
const MAX_ATTEMPTS: u32 = 4;
const RETRY_BASE_DELAY_MS: u64 = 250;

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() == 3 && args[1] == "supports" {
        // Only the html renderer benefits from inline SVG. Skip others cleanly.
        if args[2] == "html" {
            std::process::exit(0);
        }
        std::process::exit(1);
    }

    if let Err(e) = run() {
        eprintln!("[mdbook-d2] fatal: {e}");
        std::process::exit(1);
    }
}

fn run() -> Result<(), String> {
    let mut input = String::new();
    io::stdin()
        .read_to_string(&mut input)
        .map_err(|e| format!("read stdin: {e}"))?;

    let mut payload: Value =
        serde_json::from_str(&input).map_err(|e| format!("parse stdin JSON: {e}"))?;

    let book = payload
        .get_mut(1)
        .ok_or_else(|| "stdin payload must be [ctx, book]".to_string())?;

    let items = book
        .get_mut("items")
        .and_then(|v| v.as_array_mut())
        .ok_or_else(|| "book.items missing or not an array".to_string())?;

    let renderer = pick_renderer();
    let cache_dir = PathBuf::from(env::var(CACHE_DIR_ENV).unwrap_or_else(|_| DEFAULT_CACHE_DIR.to_string()));
    fs::create_dir_all(&cache_dir).map_err(|e| format!("create cache dir {}: {e}", cache_dir.display()))?;

    // Pass 1: collect all D2 sources, replace blocks with placeholders.
    let mut sources: Vec<String> = Vec::new();
    rewrite_with_placeholders(items, &mut sources);

    if sources.is_empty() {
        // No D2 in this book; just emit it back unchanged.
        return serde_json::to_writer(io::stdout(), book)
            .map_err(|e| format!("write stdout: {e}"));
    }

    // Pass 2: parallel render (cache-aware).
    let started = Instant::now();
    let (results, stats) = render_all(sources, &renderer, &cache_dir);
    let elapsed = started.elapsed();
    eprintln!(
        "[mdbook-d2] {} blocks in {:.2}s ({} cached, {} fetched, {} failed)",
        stats.total,
        elapsed.as_secs_f64(),
        stats.cached,
        stats.fetched,
        stats.failed
    );

    // Pass 3: substitute placeholders with SVGs (or error blocks).
    let mut errors: Vec<String> = Vec::new();
    substitute_placeholders(items, &results, &mut errors);

    serde_json::to_writer(io::stdout(), book).map_err(|e| format!("write stdout: {e}"))?;

    for err in &errors {
        eprintln!("[mdbook-d2] {err}");
    }
    Ok(())
}

// ---------------------------------------------------------------------------
// Pass 1: walk chapters; replace each ```d2 block with a placeholder.
// ---------------------------------------------------------------------------

fn rewrite_with_placeholders(items: &mut Vec<Value>, sources: &mut Vec<String>) {
    for item in items.iter_mut() {
        let Some(chapter) = item.get_mut("Chapter") else {
            continue;
        };

        if let Some(content_str) = chapter.get("content").and_then(|v| v.as_str()) {
            let new_content = replace_d2_blocks_with_placeholders(content_str, sources);
            chapter["content"] = Value::String(new_content);
        }

        if let Some(sub_items) = chapter.get_mut("sub_items").and_then(|v| v.as_array_mut()) {
            rewrite_with_placeholders(sub_items, sources);
        }
    }
}

fn replace_d2_blocks_with_placeholders(markdown: &str, sources: &mut Vec<String>) -> String {
    enum State {
        Outside,
        InsideD2 { source: String },
        InsideOther { fence: String },
    }

    let mut out = String::with_capacity(markdown.len());
    let mut state = State::Outside;

    for line in markdown.split_inclusive('\n') {
        let stripped = line.trim_end_matches('\n').trim_end_matches('\r');
        match &mut state {
            State::Outside => {
                if stripped == FENCE_OPEN || stripped.starts_with("```d2 ") {
                    state = State::InsideD2 {
                        source: String::new(),
                    };
                } else if let Some(fence) = leading_fence(stripped) {
                    out.push_str(line);
                    state = State::InsideOther {
                        fence: fence.to_string(),
                    };
                } else {
                    out.push_str(line);
                }
            }
            State::InsideD2 { source } => {
                if stripped == FENCE_CLOSE {
                    let idx = sources.len();
                    sources.push(std::mem::take(source));
                    out.push_str(&placeholder_for(idx));
                    out.push('\n');
                    state = State::Outside;
                } else {
                    source.push_str(line);
                }
            }
            State::InsideOther { fence } => {
                out.push_str(line);
                if stripped == fence {
                    state = State::Outside;
                }
            }
        }
    }

    // If the file ended mid-d2-block, restore raw content so we don't silently
    // drop user text.
    if let State::InsideD2 { source } = state {
        out.push_str(FENCE_OPEN);
        out.push('\n');
        out.push_str(&source);
    }

    out
}

// Returns the fence delimiter (e.g. "```", "````") if `line` opens a fenced
// block in a language we don't handle, otherwise None.
fn leading_fence(line: &str) -> Option<&str> {
    let trimmed = line.trim_start();
    let backticks: usize = trimmed.chars().take_while(|&c| c == '`').count();
    if backticks < 3 {
        return None;
    }
    Some(&trimmed[..backticks])
}

fn placeholder_for(idx: usize) -> String {
    format!("{PLACEHOLDER_PREFIX}{idx}{PLACEHOLDER_SUFFIX}")
}

// ---------------------------------------------------------------------------
// Pass 2: parallel render with disk cache.
// ---------------------------------------------------------------------------

#[derive(Default)]
struct RenderStats {
    total: usize,
    cached: usize,
    fetched: usize,
    failed: usize,
}

enum RenderOutcome {
    Cached(String),
    Fetched(String),
    Failed(String),
}

fn render_all(
    sources: Vec<String>,
    renderer: &Renderer,
    cache_dir: &Path,
) -> (Vec<Result<String, String>>, RenderStats) {
    let total = sources.len();
    if total == 0 {
        return (Vec::new(), RenderStats::default());
    }

    let renderer = Arc::new(renderer.clone());
    let cache_dir = Arc::new(cache_dir.to_path_buf());

    // Round-robin partition into N buckets.
    let workers = MAX_CONCURRENT.min(total);
    let mut buckets: Vec<Vec<(usize, String)>> = (0..workers).map(|_| Vec::new()).collect();
    for (i, src) in sources.into_iter().enumerate() {
        buckets[i % workers].push((i, src));
    }

    let mut outcomes: Vec<Option<RenderOutcome>> = (0..total).map(|_| None).collect();

    std::thread::scope(|scope| {
        let mut handles = Vec::with_capacity(workers);
        for bucket in buckets {
            let renderer = Arc::clone(&renderer);
            let cache_dir = Arc::clone(&cache_dir);
            let handle = scope.spawn(move || {
                bucket
                    .into_iter()
                    .map(|(idx, src)| (idx, render_one_cached(&src, &renderer, &cache_dir)))
                    .collect::<Vec<_>>()
            });
            handles.push(handle);
        }
        for handle in handles {
            let chunk = handle.join().expect("worker thread panicked");
            for (idx, outcome) in chunk {
                outcomes[idx] = Some(outcome);
            }
        }
    });

    let mut stats = RenderStats {
        total,
        ..Default::default()
    };
    let results: Vec<Result<String, String>> = outcomes
        .into_iter()
        .map(|o| match o.expect("missing outcome — bug") {
            RenderOutcome::Cached(svg) => {
                stats.cached += 1;
                Ok(svg)
            }
            RenderOutcome::Fetched(svg) => {
                stats.fetched += 1;
                Ok(svg)
            }
            RenderOutcome::Failed(e) => {
                stats.failed += 1;
                Err(e)
            }
        })
        .collect();

    (results, stats)
}

fn render_one_cached(source: &str, renderer: &Renderer, cache_dir: &Path) -> RenderOutcome {
    let key = cache_key(source);
    let path = cache_dir.join(format!("{key}.svg"));

    if let Ok(svg) = fs::read_to_string(&path) {
        return RenderOutcome::Cached(svg);
    }

    match renderer.render(source) {
        Ok(svg) => {
            // Best-effort cache write; failure here doesn't fail the build.
            let _ = fs::write(&path, &svg);
            RenderOutcome::Fetched(svg)
        }
        Err(e) => RenderOutcome::Failed(e),
    }
}

#[derive(Clone)]
enum Renderer {
    D2Cli { bin: String },
    Kroki { url: String },
}

fn pick_renderer() -> Renderer {
    let use_kroki = matches!(
        env::var(USE_KROKI_ENV).ok().as_deref(),
        Some("1") | Some("true") | Some("TRUE")
    );
    if use_kroki {
        let url = env::var(KROKI_URL_ENV).unwrap_or_else(|_| DEFAULT_KROKI_URL.to_string());
        Renderer::Kroki { url }
    } else {
        let bin = env::var(D2_BIN_ENV).unwrap_or_else(|_| DEFAULT_D2_BIN.to_string());
        Renderer::D2Cli { bin }
    }
}

impl Renderer {
    fn render(&self, source: &str) -> Result<String, String> {
        match self {
            Renderer::D2Cli { bin } => render_via_d2_cli(source, bin),
            Renderer::Kroki { url } => render_via_kroki(source, url),
        }
    }
}

fn cache_key(source: &str) -> String {
    let mut hasher = DefaultHasher::new();
    CACHE_VERSION.hash(&mut hasher);
    source.hash(&mut hasher);
    format!("{:016x}", hasher.finish())
}

fn render_via_d2_cli(source: &str, bin: &str) -> Result<String, String> {
    // d2 reads from stdin and writes to stdout when both paths are "-".
    // Disable colour codes in stderr to keep error messages readable when
    // surfaced through mdbook.
    //
    // `--pad 30` tightens d2's default 100-px canvas padding so individual
    // diagrams don't dominate the viewport on otherwise-tall pages. The
    // value is small enough to keep arrowheads and labels from clipping.
    let mut child = Command::new(bin)
        .args(["--pad", "30", "-", "-"])
        .env("NO_COLOR", "1")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| {
            if let io::ErrorKind::NotFound = e.kind() {
                format!(
                    "d2 binary `{bin}` not found on PATH. Install from https://d2lang.com/ \
                     or set {D2_BIN_ENV} to its absolute path. To fall back to kroki.io, \
                     set {USE_KROKI_ENV}=1."
                )
            } else {
                format!("spawn `{bin}`: {e}")
            }
        })?;

    {
        let stdin = child
            .stdin
            .as_mut()
            .ok_or_else(|| "d2 stdin unavailable".to_string())?;
        stdin
            .write_all(source.as_bytes())
            .map_err(|e| format!("write source to d2: {e}"))?;
    }

    let output = child
        .wait_with_output()
        .map_err(|e| format!("wait d2: {e}"))?;

    if !output.status.success() {
        let err = String::from_utf8_lossy(&output.stderr);
        let body = String::from_utf8_lossy(&output.stdout);
        return Err(format!(
            "d2 status {}: {}{}",
            output.status,
            err.trim(),
            if body.trim().is_empty() {
                String::new()
            } else {
                format!(" — output: {}", body.trim())
            }
        ));
    }

    let svg = String::from_utf8(output.stdout).map_err(|e| format!("svg utf-8: {e}"))?;
    Ok(post_process_svg(&svg))
}

fn render_via_kroki(source: &str, kroki_url: &str) -> Result<String, String> {
    let mut last_err = String::new();
    for attempt in 1..=MAX_ATTEMPTS {
        match render_via_kroki_once(source, kroki_url) {
            Ok(svg) => return Ok(svg),
            Err(e) => {
                let retryable = is_retryable(&e);
                if !retryable || attempt == MAX_ATTEMPTS {
                    return Err(if attempt > 1 {
                        format!("after {attempt} attempts: {e}")
                    } else {
                        e
                    });
                }
                last_err = e;
                // 250ms, 500ms, 1000ms.
                let backoff = RETRY_BASE_DELAY_MS * (1u64 << (attempt - 1));
                thread::sleep(Duration::from_millis(backoff));
            }
        }
    }
    Err(last_err)
}

fn is_retryable(err: &str) -> bool {
    // curl network / connection / timeout errors.
    for code in ["(6)", "(7)", "(18)", "(28)", "(52)", "(55)", "(56)"] {
        if err.contains(code) {
            return true;
        }
    }
    // HTTP statuses worth retrying.
    if let Some(status) = parse_http_status(err) {
        return status >= 500 || status == 408 || status == 425 || status == 429;
    }
    false
}

fn parse_http_status(err: &str) -> Option<u16> {
    // curl --fail-with-body emits: "curl: (22) The requested URL returned error: 504"
    let needle = "returned error: ";
    let idx = err.find(needle)?;
    let after = &err[idx + needle.len()..];
    let digits: String = after.chars().take_while(|c| c.is_ascii_digit()).collect();
    digits.parse().ok()
}

fn render_via_kroki_once(source: &str, kroki_url: &str) -> Result<String, String> {
    let mut child = Command::new("curl")
        .args([
            "-sS",
            "--fail-with-body",
            "--connect-timeout",
            "10",
            "--max-time",
            "60",
            "-X",
            "POST",
            "-H",
            "Content-Type: text/plain",
            "--data-binary",
            "@-",
            kroki_url,
        ])
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("spawn curl: {e}"))?;

    {
        let stdin = child
            .stdin
            .as_mut()
            .ok_or_else(|| "curl stdin unavailable".to_string())?;
        stdin
            .write_all(source.as_bytes())
            .map_err(|e| format!("write source to curl: {e}"))?;
    }

    let output = child
        .wait_with_output()
        .map_err(|e| format!("wait curl: {e}"))?;

    if !output.status.success() {
        let body = String::from_utf8_lossy(&output.stdout);
        let err = String::from_utf8_lossy(&output.stderr);
        return Err(format!(
            "curl status {}: {}{}",
            output.status,
            err.trim(),
            if body.trim().is_empty() {
                String::new()
            } else {
                format!(" — body: {}", body.trim())
            }
        ));
    }

    let svg = String::from_utf8(output.stdout).map_err(|e| format!("svg utf-8: {e}"))?;
    Ok(post_process_svg(&svg))
}

fn post_process_svg(svg: &str) -> String {
    // Strip leading <?xml …?> declaration so the SVG inlines cleanly inside
    // a <div>. The XML decl is harmless but makes raw HTML noisier.
    let stripped = if let Some(rest) = svg.trim_start().strip_prefix("<?xml") {
        match rest.find("?>") {
            Some(idx) => rest[idx + 2..].trim_start().to_string(),
            None => svg.to_string(),
        }
    } else {
        svg.to_string()
    };

    // CommonMark "Type 6" HTML blocks (including <div>) terminate at a blank
    // line, after which markdown parsing resumes mid-SVG and wraps fragments
    // in <p> tags — producing broken HTML. Collapse any blank lines inside the
    // SVG into a single newline so the entire div stays one HTML block.
    collapse_blank_lines(&stripped)
}

fn collapse_blank_lines(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    let mut last_was_newline = false;
    for line in s.split_inclusive('\n') {
        let body = line.trim_end_matches('\n').trim_end_matches('\r');
        if body.trim().is_empty() {
            // Skip blank lines entirely; the closing newline of the previous
            // non-blank line is enough separation.
            continue;
        }
        out.push_str(body);
        out.push('\n');
        last_was_newline = true;
    }
    if !last_was_newline {
        out.push('\n');
    }
    out
}

// ---------------------------------------------------------------------------
// Pass 3: substitute placeholders with rendered SVGs (or error blocks).
// ---------------------------------------------------------------------------

fn substitute_placeholders(
    items: &mut Vec<Value>,
    results: &[Result<String, String>],
    errors: &mut Vec<String>,
) {
    for item in items.iter_mut() {
        let Some(chapter) = item.get_mut("Chapter") else {
            continue;
        };

        if let Some(content_str) = chapter.get("content").and_then(|v| v.as_str()) {
            let new_content = replace_placeholders_in_string(content_str, results, errors);
            chapter["content"] = Value::String(new_content);
        }

        if let Some(sub_items) = chapter.get_mut("sub_items").and_then(|v| v.as_array_mut()) {
            substitute_placeholders(sub_items, results, errors);
        }
    }
}

fn replace_placeholders_in_string(
    content: &str,
    results: &[Result<String, String>],
    errors: &mut Vec<String>,
) -> String {
    let mut out = String::with_capacity(content.len());
    let mut remaining = content;

    while let Some(start) = remaining.find(PLACEHOLDER_PREFIX) {
        out.push_str(&remaining[..start]);
        let after_prefix = &remaining[start + PLACEHOLDER_PREFIX.len()..];

        let Some(suffix_offset) = after_prefix.find(PLACEHOLDER_SUFFIX) else {
            // Malformed placeholder — emit the rest verbatim.
            out.push_str(&remaining[start..]);
            return out;
        };

        let idx_str = &after_prefix[..suffix_offset];
        let idx_parsed: Result<usize, _> = idx_str.parse();
        let idx_valid = idx_parsed.as_ref().map(|i| *i < results.len()).unwrap_or(false);

        if !idx_valid {
            // Not one of ours — could be a literal HTML comment that happens
            // to start with our prefix. Emit verbatim.
            let end = start + PLACEHOLDER_PREFIX.len() + suffix_offset + PLACEHOLDER_SUFFIX.len();
            out.push_str(&remaining[start..end]);
            remaining = &remaining[end..];
            continue;
        }

        let idx = idx_parsed.expect("validated above");
        match &results[idx] {
            Ok(svg) => {
                out.push_str("<div class=\"d2\">\n");
                out.push_str(svg);
                if !svg.ends_with('\n') {
                    out.push('\n');
                }
                out.push_str("</div>");
            }
            Err(e) => {
                errors.push(format!("d2 render failed: {e}"));
                out.push_str("<div class=\"d2 d2--error\">\n<strong>D2 render error:</strong> ");
                out.push_str(&html_escape(e));
                out.push_str("\n</div>");
            }
        }

        remaining = &after_prefix[suffix_offset + PLACEHOLDER_SUFFIX.len()..];
    }

    out.push_str(remaining);
    out
}

fn html_escape(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    for c in s.chars() {
        match c {
            '&' => out.push_str("&amp;"),
            '<' => out.push_str("&lt;"),
            '>' => out.push_str("&gt;"),
            '"' => out.push_str("&quot;"),
            '\'' => out.push_str("&#39;"),
            _ => out.push(c),
        }
    }
    out
}
