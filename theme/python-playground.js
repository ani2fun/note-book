'use strict';

(function pythonPlayground() {
    const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js';
    const ACE_PYTHON_MODE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.39.1/mode-python.min.js';

    let pyodideReadyPromise = null;
    let aceModeReadyPromise = null;

    function loadScriptOnce(url) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(`script[src="${url}"]`);
            if (existing) {
                existing.addEventListener('load', resolve, { once: true });
                existing.addEventListener('error', () => reject(new Error(`Failed to load ${url}`)), { once: true });
                if (existing.dataset.loaded === 'true') {
                    resolve();
                }
                return;
            }

            const script = document.createElement('script');
            script.src = url;
            script.async = true;
            script.addEventListener('load', () => {
                script.dataset.loaded = 'true';
                resolve();
            }, { once: true });
            script.addEventListener('error', () => reject(new Error(`Failed to load ${url}`)), { once: true });
            document.head.appendChild(script);
        });
    }

    async function ensureAcePythonMode() {
        if (!window.ace) {
            return;
        }

        if (!aceModeReadyPromise) {
            aceModeReadyPromise = loadScriptOnce(ACE_PYTHON_MODE_URL);
        }

        await aceModeReadyPromise;
    }

    async function ensurePyodide() {
        if (window.pyodide) {
            return window.pyodide;
        }

        if (!pyodideReadyPromise) {
            pyodideReadyPromise = (async () => {
                await loadScriptOnce(PYODIDE_URL);
                const instance = await window.loadPyodide();
                window.pyodide = instance;
                return instance;
            })();
        }

        return pyodideReadyPromise;
    }

    function getEditorForBlock(codeBlock) {
        if (!window.ace || !codeBlock.classList.contains('editable')) {
            return null;
        }
        return window.ace.edit(codeBlock);
    }

    function getCodeText(codeBlock) {
        const editor = getEditorForBlock(codeBlock);
        return editor ? editor.getValue() : codeBlock.textContent;
    }

    function getResultBlock(preBlock) {
        let resultBlock = preBlock.querySelector('.result');
        if (!resultBlock) {
            resultBlock = document.createElement('code');
            resultBlock.className = 'result hljs language-plaintext';
            preBlock.appendChild(resultBlock);
        }
        return resultBlock;
    }

    function setResult(preBlock, text, isError) {
        const resultBlock = getResultBlock(preBlock);
        resultBlock.textContent = text;
        resultBlock.classList.toggle('result-error', Boolean(isError));
        resultBlock.classList.toggle('result-no-output', text === 'No output');
    }

    async function runPython(preBlock, button) {
        const codeBlock = preBlock.querySelector('code');
        const source = getCodeText(codeBlock);

        button.classList.add('is-loading');
        button.disabled = true;
        setResult(preBlock, 'Loading Python runtime...', false);

        try {
            const pyodide = await ensurePyodide();
            const output = [];

            pyodide.setStdout({
                batched(message) {
                    output.push(message);
                },
            });

            pyodide.setStderr({
                batched(message) {
                    output.push(message);
                },
            });

            await pyodide.runPythonAsync(source);

            const text = output.join('\n').trim();
            setResult(preBlock, text || 'No output', false);
        } catch (error) {
            setResult(preBlock, error.message || String(error), true);
        } finally {
            button.classList.remove('is-loading');
            button.disabled = false;
        }
    }

    async function configurePythonEditors(codeBlocks) {
        await ensureAcePythonMode();

        codeBlocks.forEach(codeBlock => {
            const editor = getEditorForBlock(codeBlock);
            if (editor) {
                editor.getSession().setMode('ace/mode/python');
                editor.originalCode = editor.getValue();
            }
        });
    }

    function cloneFaIcon(templateId) {
        const template = document.getElementById(templateId);
        return template ? template.content.cloneNode(true) : null;
    }

    function addButtons(preBlock) {
        let buttons = preBlock.querySelector('.buttons');
        if (!buttons) {
            buttons = document.createElement('div');
            buttons.className = 'buttons';
            preBlock.insertBefore(buttons, preBlock.firstChild);
        }

        const runButton = document.createElement('button');
        runButton.className = 'play-button';
        runButton.title = 'Run this Python code (Ctrl+Enter)';
        runButton.setAttribute('aria-label', runButton.title);
        const playIcon = cloneFaIcon('fa-play');
        if (playIcon) runButton.appendChild(playIcon);
        buttons.insertBefore(runButton, buttons.firstChild);

        runButton.addEventListener('click', () => {
            runPython(preBlock, runButton);
        });

        const codeBlock = preBlock.querySelector('code');
        if (window.ace && codeBlock.classList.contains('editable')) {
            const resetButton = document.createElement('button');
            resetButton.className = 'reset-button';
            resetButton.title = 'Undo changes';
            resetButton.setAttribute('aria-label', resetButton.title);
            // FA6 renamed fa-history → fa-clock-rotate-left
            const historyIcon = cloneFaIcon('fa-clock-rotate-left') || cloneFaIcon('fa-history');
            if (historyIcon) resetButton.appendChild(historyIcon);
            buttons.insertBefore(resetButton, buttons.firstChild);

            resetButton.addEventListener('click', () => {
                const editor = getEditorForBlock(codeBlock);
                if (editor) {
                    editor.setValue(editor.originalCode);
                    editor.clearSelection();
                }
            });

            const editor = getEditorForBlock(codeBlock);
            if (editor) {
                editor.commands.addCommand({
                    name: 'run-python',
                    bindKey: {
                        win: 'Ctrl-Enter',
                        mac: 'Ctrl-Enter',
                    },
                    exec: () => runPython(preBlock, runButton),
                });
            }
        }
    }

    const pythonCodeBlocks = Array.from(document.querySelectorAll('pre code.language-python.editable'));
    if (pythonCodeBlocks.length === 0) {
        return;
    }

    pythonCodeBlocks.forEach(codeBlock => {
        const preBlock = codeBlock.parentElement;
        preBlock.classList.add('python-playground');
        addButtons(preBlock);
    });

    configurePythonEditors(pythonCodeBlocks).catch(error => {
        console.error('Failed to configure Python editors', error);
    });
})();
