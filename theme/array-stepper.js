'use strict';

// Step-through array visualisation widget.
//
// Markdown authors write a single self-closing div:
//
//   <div class="array-stepper"
//        data-values="1, 2, 3, 4, 5"
//        data-label="index"></div>
//
// Optional attributes:
//   data-values    — comma-separated cell values (required, ≥ 2 cells)
//   data-label     — variable name shown above the array. Default: "index".
//   data-start     — starting index (0-based). Default: 0.
//   data-direction — "forward" (default) or "backward". Determines what
//                    Prev / Next mean and which end Reset returns to.
//   data-step-format — printf-ish format for the step counter. Default:
//                      "step {n} of {total}".
//
// On DOMContentLoaded the widget renders a row of cells, a label such as
// "index = 0", and Prev / Next / Reset buttons. The active cell is
// highlighted in the project's accent palette.

(function arrayStepper() {
    const ACCENT = {
        bg:     '#dbeafe',
        border: '#3b82f6',
        text:   '#1e3a5f',
    };
    const IDLE = {
        bg:     '#f8fafc',
        border: '#94a3b8',
        text:   '#475569',
    };

    function init(container) {
        const rawValues = container.dataset.values || '';
        const values = rawValues.split(',').map(s => s.trim()).filter(Boolean);
        if (values.length < 2) return;

        const label = container.dataset.label || 'index';
        const startIdx = clampIdx(parseInt(container.dataset.start, 10) || 0, values.length);
        const stepFormat = container.dataset.stepFormat || 'step {n} of {total}';

        let idx = startIdx;

        // Build DOM.
        container.innerHTML = '';
        container.style.cssText = 'margin: 1.25rem 0;';

        const labelEl = document.createElement('p');
        labelEl.className = 'array-stepper__label';
        labelEl.style.cssText = 'font-family: monospace; font-size: 1.05em; margin: 0 0 0.5rem;';
        container.appendChild(labelEl);

        const arrayEl = document.createElement('div');
        arrayEl.className = 'array-stepper__cells';
        arrayEl.style.cssText = 'display: flex; gap: 4px; margin-bottom: 0.75rem; flex-wrap: wrap;';
        container.appendChild(arrayEl);

        const controls = document.createElement('div');
        controls.className = 'array-stepper__controls';
        controls.style.cssText = 'display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;';
        container.appendChild(controls);

        const prevBtn = makeBtn('◀ Prev', () => goTo(idx - 1));
        const nextBtn = makeBtn('Next ▶', () => goTo(idx + 1));
        const resetBtn = makeBtn('↺ Reset', () => goTo(startIdx));

        const stepLabel = document.createElement('span');
        stepLabel.className = 'array-stepper__step';
        stepLabel.style.cssText = 'font-family: monospace; color: #64748b; font-size: 0.9em;';

        controls.appendChild(prevBtn);
        controls.appendChild(nextBtn);
        controls.appendChild(resetBtn);
        controls.appendChild(stepLabel);

        // Keyboard nav when the widget has focus or hover.
        container.tabIndex = 0;
        container.style.outline = 'none';
        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goTo(idx - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                goTo(idx + 1);
            }
        });

        render();

        function makeBtn(text, onClick) {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'array-stepper__btn';
            b.textContent = text;
            b.style.cssText = 'padding: 6px 14px; cursor: pointer; border-radius: 4px; border: 1px solid #94a3b8; background: #f8fafc; font-size: 0.9em;';
            b.addEventListener('click', onClick);
            return b;
        }

        function goTo(next) {
            const clamped = clampIdx(next, values.length);
            if (clamped === idx) {
                render();
                return;
            }
            idx = clamped;
            render();
        }

        function render() {
            labelEl.textContent = `${label} = ${idx}`;
            stepLabel.textContent = stepFormat
                .replace('{n}', String(idx + 1))
                .replace('{total}', String(values.length));
            prevBtn.disabled = idx === 0;
            nextBtn.disabled = idx === values.length - 1;

            arrayEl.innerHTML = '';
            values.forEach((val, i) => {
                const cell = document.createElement('div');
                const active = i === idx;
                const palette = active ? ACCENT : IDLE;
                cell.style.cssText = [
                    'min-width: 64px',
                    'padding: 10px 6px',
                    'text-align: center',
                    'border: 2px solid ' + palette.border,
                    'border-radius: 4px',
                    'background: ' + palette.bg,
                    'color: ' + palette.text,
                    'font-family: monospace',
                    'font-size: 0.95em',
                    'transition: all 0.15s',
                ].join(';');
                cell.innerHTML =
                    '<div>' + escapeHtml(val) + '</div>' +
                    '<div style="font-size:0.75em;margin-top:4px;color:#64748b;">[' + i + ']</div>';
                arrayEl.appendChild(cell);
            });
        }
    }

    function clampIdx(i, n) {
        if (!Number.isFinite(i)) return 0;
        if (i < 0) return 0;
        if (i >= n) return n - 1;
        return i;
    }

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function run() {
        document.querySelectorAll('.array-stepper').forEach(init);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();
