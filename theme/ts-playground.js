'use strict';

(function tsPlayground() {
    const TS_CDN = 'https://cdn.jsdelivr.net/npm/typescript@5/lib/typescript.js';
    let tsReadyPromise = null;

    function cloneFaIcon(id) {
        const t = document.getElementById(id);
        return t ? t.content.cloneNode(true) : null;
    }

    function loadScriptOnce(url) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(`script[src="${url}"]`);
            if (existing) {
                if (existing.dataset.loaded === 'true') { resolve(); return; }
                existing.addEventListener('load',  resolve, { once: true });
                existing.addEventListener('error', () => reject(new Error(`Failed to load ${url}`)), { once: true });
                return;
            }
            const s = document.createElement('script');
            s.src = url;
            s.async = true;
            s.addEventListener('load', () => { s.dataset.loaded = 'true'; resolve(); }, { once: true });
            s.addEventListener('error', () => reject(new Error(`Failed to load ${url}`)), { once: true });
            document.head.appendChild(s);
        });
    }

    function ensureTs() {
        if (window.ts) return Promise.resolve();
        if (!tsReadyPromise) {
            tsReadyPromise = loadScriptOnce(TS_CDN);
        }
        return tsReadyPromise;
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

    async function runTs(pre, btn) {
        const code   = pre.querySelector('code');
        const source = getCodeText(code);

        btn.disabled = true;
        btn.classList.add('is-loading');

        const resultBlock = getResultBlock(pre);
        resultBlock.classList.remove('result-error', 'result-no-output');
        resultBlock.textContent = 'Loading TypeScript compiler…';

        try {
            await ensureTs();

            // Transpile TypeScript → JavaScript
            const result = window.ts.transpileModule(source, {
                compilerOptions: {
                    target:  window.ts.ScriptTarget.ES2020,
                    module:  window.ts.ModuleKind.None,
                    strict:  false,
                },
            });

            const jsSource = result.outputText;
            const output   = [];

            const origLog   = console.log;
            const origError = console.error;
            const origWarn  = console.warn;

            const capture = (...args) => output.push(
                args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' ')
            );

            console.log   = capture;
            console.error = capture;
            console.warn  = capture;

            try {
                // eslint-disable-next-line no-new-func
                new Function(jsSource)();
            } catch (err) {
                output.push(err.message || String(err));
                resultBlock.classList.add('result-error');
            } finally {
                console.log   = origLog;
                console.error = origError;
                console.warn  = origWarn;
            }

            const text = output.join('\n').trim();
            resultBlock.textContent = text || 'No output';
            if (!text) resultBlock.classList.add('result-no-output');

        } catch (err) {
            resultBlock.textContent = err.message || String(err);
            resultBlock.classList.add('result-error');
        } finally {
            btn.disabled = false;
            btn.classList.remove('is-loading');
        }
    }

    function addButtons(pre) {
        let buttons = pre.querySelector('.buttons');
        if (!buttons) {
            buttons = document.createElement('div');
            buttons.className = 'buttons';
            pre.insertBefore(buttons, pre.firstChild);
        }

        const runBtn = document.createElement('button');
        runBtn.className = 'play-button';
        runBtn.title     = 'Run this TypeScript code (Ctrl+Enter)';
        runBtn.setAttribute('aria-label', runBtn.title);
        const playIcon = cloneFaIcon('fa-play');
        if (playIcon) runBtn.appendChild(playIcon);
        buttons.insertBefore(runBtn, buttons.firstChild);
        runBtn.addEventListener('click', () => runTs(pre, runBtn));

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
                    name:    'run-ts',
                    bindKey: { win: 'Ctrl-Enter', mac: 'Ctrl-Enter' },
                    exec:    () => runTs(pre, runBtn),
                });
            } catch (_) {}
        }
    }

    const blocks = document.querySelectorAll('pre code.language-typescript.editable');
    blocks.forEach(code => {
        const pre = code.parentElement;
        pre.classList.add('ts-playground');
        addButtons(pre);
    });
})();
