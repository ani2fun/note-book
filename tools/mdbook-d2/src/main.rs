// mdbook preprocessor: renders ```d2 fenced blocks to inline SVG via kroki.io.
//
// Protocol (mdbook): https://rust-lang.github.io/mdBook/for_developers/preprocessors.html
//   * Invoked as `mdbook-d2 supports <renderer>` to advertise renderer support.
//     Exit 0 = supported; non-zero = skipped.
//   * Invoked as `mdbook-d2` to preprocess: reads `[ctx, book]` JSON from stdin,
//     writes the modified `book` JSON to stdout.

use std::env;
use std::io::{self, Read, Write};
use std::process::{Command, Stdio};

use serde_json::Value;

const KROKI_URL_ENV: &str = "MDBOOK_D2_KROKI_URL";
const DEFAULT_KROKI_URL: &str = "https://kroki.io/d2/svg";
const FENCE_OPEN: &str = "```d2";
const FENCE_CLOSE: &str = "```";

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

    let kroki_url = env::var(KROKI_URL_ENV).unwrap_or_else(|_| DEFAULT_KROKI_URL.to_string());

    let mut errors: Vec<String> = Vec::new();
    process_items(items, &kroki_url, &mut errors);

    serde_json::to_writer(io::stdout(), book).map_err(|e| format!("write stdout: {e}"))?;

    if !errors.is_empty() {
        // Non-fatal: surface to build log but let the book still render with the
        // raw fence + error text injected by render_d2_blocks.
        for err in &errors {
            eprintln!("[mdbook-d2] {err}");
        }
    }
    Ok(())
}

fn process_items(items: &mut Vec<Value>, kroki_url: &str, errors: &mut Vec<String>) {
    for item in items.iter_mut() {
        let Some(chapter) = item.get_mut("Chapter") else {
            continue;
        };

        if let Some(content_str) = chapter.get("content").and_then(|v| v.as_str()) {
            let new_content = render_d2_blocks(content_str, kroki_url, errors);
            chapter["content"] = Value::String(new_content);
        }

        if let Some(sub_items) = chapter.get_mut("sub_items").and_then(|v| v.as_array_mut()) {
            process_items(sub_items, kroki_url, errors);
        }
    }
}

// Walk markdown line-by-line; replace each ```d2 fenced block with inline SVG.
// We respect non-d2 fenced blocks so we don't accidentally rewrite content that
// happens to contain `````d2` inside, e.g., a docs-about-d2 example block.
fn render_d2_blocks(markdown: &str, kroki_url: &str, errors: &mut Vec<String>) -> String {
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
                    let svg = match render_one(source, kroki_url) {
                        Ok(svg) => svg,
                        Err(e) => {
                            errors.push(format!("kroki render failed: {e}"));
                            // Fall back to a visible error block so the issue is
                            // obvious in the rendered page.
                            out.push_str("<div class=\"d2 d2--error\">\n");
                            out.push_str(&format!(
                                "<strong>D2 render error:</strong> {}\n<pre>",
                                html_escape(&e)
                            ));
                            out.push_str(&html_escape(source));
                            out.push_str("</pre>\n</div>\n");
                            state = State::Outside;
                            continue;
                        }
                    };
                    out.push_str("<div class=\"d2\">\n");
                    out.push_str(&svg);
                    if !svg.ends_with('\n') {
                        out.push('\n');
                    }
                    out.push_str("</div>\n");
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

fn render_one(source: &str, kroki_url: &str) -> Result<String, String> {
    let mut child = Command::new("curl")
        .args([
            "-sS",
            "--fail-with-body",
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

    // Strip leading <?xml …?> declaration so the SVG inlines cleanly inside
    // a <div>. The XML decl is harmless but makes raw HTML noisier.
    let svg = if let Some(rest) = svg.trim_start().strip_prefix("<?xml") {
        match rest.find("?>") {
            Some(idx) => rest[idx + 2..].trim_start().to_string(),
            None => svg,
        }
    } else {
        svg
    };

    // CommonMark "Type 6" HTML blocks (including <div>) terminate at a blank
    // line, after which markdown parsing resumes mid-SVG and wraps fragments
    // in <p> tags — producing broken HTML. Collapse any blank lines inside the
    // SVG into a single newline so the entire div stays one HTML block.
    Ok(collapse_blank_lines(&svg))
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
