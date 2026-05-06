'use strict';

(function pistonPlayground() {
    // Prefer a runtime override when present.
    // On the public notebook site, use the same-origin ingress path so browsers do not need CORS.
    // For local dev: kubectl port-forward svc/piston 2000:2000 -n apps-prod
    function getDefaultPistonUrl() {
        const hostname = window.location.hostname;
        if (hostname === 'notebook.kakde.eu') {
            return `${window.location.origin}/api/v2/execute`;
        }
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:2000/api/v2/execute';
        }
        return 'https://piston.kakde.eu/api/v2/execute';
    }

    const PISTON_URL = window.NOTEBOOK_PISTON_URL || getDefaultPistonUrl();
    const PISTON_LIMITS = {
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_memory_limit: 536870912,
        run_memory_limit: 268435456,
    };

    // Map from the CSS language class name to Piston's language identifier
    const PISTON_LANG = {
        java:   'java',
        c:      'c',
        cpp:    'c++',
        go:     'go',
        scala:  'scala',
        rust:   'rust',
    };

    // Selectors for each language this playground handles
    const SELECTORS = Object.keys(PISTON_LANG)
        .map(lang => `pre code.language-${lang}.editable`)
        .join(', ');

    function cloneFaIcon(id) {
        const t = document.getElementById(id);
        return t ? t.content.cloneNode(true) : null;
    }

    function getCodeText(codeBlock) {
        if (window.ace) {
            try { return window.ace.edit(codeBlock).getValue(); } catch (_) {}
        }
        return codeBlock.textContent;
    }

    function getResultBlock(pre) {
        let r = pre.querySelector('.result');
        if (!r) {
            r = document.createElement('code');
            r.className = 'result hljs language-plaintext';
            pre.appendChild(r);
        }
        return r;
    }

    function detectLang(codeBlock) {
        for (const cls of codeBlock.classList) {
            const m = cls.match(/^language-(.+)$/);
            if (m && PISTON_LANG[m[1]]) return m[1];
        }
        return null;
    }

    async function runPiston(pre, btn, cssLang) {
        const code        = pre.querySelector('code');
        const source      = getCodeText(code);
        const pistonLang  = PISTON_LANG[cssLang];
        const controller  = typeof AbortController === 'function' ? new AbortController() : null;
        const timeoutId   = controller ? window.setTimeout(() => controller.abort(), 20000) : null;

        btn.disabled = true;
        btn.classList.add('is-loading');

        const resultBlock = getResultBlock(pre);
        resultBlock.classList.remove('result-error', 'result-no-output');
        resultBlock.textContent = 'Running on remote server…';

        try {
            const response = await fetch(PISTON_URL, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                signal:  controller ? controller.signal : undefined,
                body:    JSON.stringify({
                    language: pistonLang,
                    version:  '*',
                    files:    [{ content: source }],
                    ...PISTON_LIMITS,
                }),
            });

            if (!response.ok) {
                throw new Error(`Piston API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Piston returns compile + run stages; prefer run output
            const stage  = data.run || data.compile || {};
            const stdout = (stage.stdout || '').trim();
            const stderr = (stage.stderr || '').trim();
            const combined = [stdout, stderr].filter(Boolean).join('\n');

            if (stage.code !== 0 && stage.code !== null) {
                resultBlock.classList.add('result-error');
            }

            resultBlock.textContent = combined || 'No output';
            if (!combined) resultBlock.classList.add('result-no-output');

        } catch (err) {
            const isAbort = err && err.name === 'AbortError';
            const message = isAbort
                ? 'Request timed out while waiting for the Piston API.'
                : (err && err.message) || String(err);
            resultBlock.textContent = `Error: ${message}`;
            resultBlock.classList.add('result-error');
        } finally {
            if (timeoutId) window.clearTimeout(timeoutId);
            btn.disabled = false;
            btn.classList.remove('is-loading');
        }
    }

    function addButtons(pre, cssLang) {
        let buttons = pre.querySelector('.buttons');
        if (!buttons) {
            buttons = document.createElement('div');
            buttons.className = 'buttons';
            pre.insertBefore(buttons, pre.firstChild);
        }

        const runBtn = document.createElement('button');
        runBtn.className = 'play-button';
        runBtn.title     = `Run this ${cssLang.toUpperCase()} code (Ctrl+Enter)`;
        runBtn.setAttribute('aria-label', runBtn.title);
        const playIcon = cloneFaIcon('fa-play');
        if (playIcon) runBtn.appendChild(playIcon);
        buttons.insertBefore(runBtn, buttons.firstChild);
        runBtn.addEventListener('click', () => runPiston(pre, runBtn, cssLang));

        const code = pre.querySelector('code');
        if (window.ace && code.classList.contains('editable')) {
            const resetBtn = document.createElement('button');
            resetBtn.className = 'reset-button';
            resetBtn.title     = 'Undo changes';
            resetBtn.setAttribute('aria-label', resetBtn.title);
            const histIcon = cloneFaIcon('fa-clock-rotate-left') || cloneFaIcon('fa-history');
            if (histIcon) resetBtn.appendChild(histIcon);
            buttons.insertBefore(resetBtn, buttons.firstChild);

            resetBtn.addEventListener('click', () => {
                try {
                    const ed = window.ace.edit(code);
                    ed.setValue(ed.originalCode);
                    ed.clearSelection();
                } catch (_) {}
            });

            try {
                const ed = window.ace.edit(code);
                ed.commands.addCommand({
                    name:    `run-${cssLang}`,
                    bindKey: { win: 'Ctrl-Enter', mac: 'Ctrl-Enter' },
                    exec:    () => runPiston(pre, runBtn, cssLang),
                });
            } catch (_) {}
        }
    }

    if (!SELECTORS) return;

    const blocks = document.querySelectorAll(SELECTORS);
    blocks.forEach(code => {
        const cssLang = detectLang(code);
        if (!cssLang) return;
        const pre = code.parentElement;
        pre.classList.add('piston-playground');
        addButtons(pre, cssLang);
    });
})();
