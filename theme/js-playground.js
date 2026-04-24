'use strict';

(function jsPlayground() {
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

    function runJs(pre, btn) {
        const code   = pre.querySelector('code');
        const source = getCodeText(code);
        const output = [];

        const origLog   = console.log;
        const origError = console.error;
        const origWarn  = console.warn;

        btn.disabled = true;
        btn.classList.add('is-loading');

        const resultBlock = getResultBlock(pre);
        resultBlock.classList.remove('result-error', 'result-no-output');

        const capture = (...args) => output.push(
            args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' ')
        );

        console.log   = capture;
        console.error = capture;
        console.warn  = capture;

        try {
            // eslint-disable-next-line no-new-func
            new Function(source)();
        } catch (err) {
            output.push(err.message || String(err));
            resultBlock.classList.add('result-error');
        } finally {
            console.log   = origLog;
            console.error = origError;
            console.warn  = origWarn;
            btn.disabled  = false;
            btn.classList.remove('is-loading');
        }

        const text = output.join('\n').trim();
        resultBlock.textContent = text || 'No output';
        if (!text) resultBlock.classList.add('result-no-output');
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
        runBtn.title     = 'Run this JavaScript code (Ctrl+Enter)';
        runBtn.setAttribute('aria-label', runBtn.title);
        const playIcon = cloneFaIcon('fa-play');
        if (playIcon) runBtn.appendChild(playIcon);
        buttons.insertBefore(runBtn, buttons.firstChild);
        runBtn.addEventListener('click', () => runJs(pre, runBtn));

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
                    name:    'run-js',
                    bindKey: { win: 'Ctrl-Enter', mac: 'Ctrl-Enter' },
                    exec:    () => runJs(pre, runBtn),
                });
            } catch (_) {}
        }
    }

    const blocks = document.querySelectorAll('pre code.language-javascript.editable');
    blocks.forEach(code => {
        const pre = code.parentElement;
        pre.classList.add('js-playground');
        addButtons(pre);
    });
})();
