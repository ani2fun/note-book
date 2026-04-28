'use strict';

// Step-through slideshow for groups of d2 diagrams.
//
// Markdown authors wrap N successive ```d2 fences in:
//
//   <div class="d2-slides" data-caption="optional">
//   ```d2
//   ...frame 1...
//   ```
//   ```d2
//   ...frame 2...
//   ```
//   </div>
//
// After mdbook + mdbook-d2 finish, this script finds every .d2-slides
// container, treats its .d2 children as frames, hides all but the
// active one, and injects Prev / Play / Next controls plus a counter.

(function d2Slides() {
    const FRAME_INTERVAL_MS = 1500;
    const ACTIVE_CLASS = 'd2-slides__frame--active';

    function init(container) {
        const frames = Array.from(container.querySelectorAll(':scope > .d2'));
        if (frames.length < 2) return;

        // State on the container element itself.
        let index = 0;
        let playTimer = null;

        frames.forEach((f, i) => {
            f.classList.toggle(ACTIVE_CLASS, i === 0);
        });

        const controls = document.createElement('div');
        controls.className = 'd2-slides__controls';

        const prevBtn = makeBtn('◀', 'Previous frame', () => {
            stopPlay();
            goTo(index - 1);
        });
        const playBtn = makeBtn('▶', 'Play', () => togglePlay());
        const nextBtn = makeBtn('▶', 'Next frame', () => {
            stopPlay();
            goTo(index + 1);
        });
        const counter = document.createElement('span');
        counter.className = 'd2-slides__counter';

        controls.appendChild(prevBtn);
        controls.appendChild(playBtn);
        controls.appendChild(nextBtn);
        controls.appendChild(counter);
        container.appendChild(controls);

        const captionText = container.dataset.caption;
        if (captionText) {
            const caption = document.createElement('div');
            caption.className = 'd2-slides__caption';
            caption.textContent = captionText;
            container.appendChild(caption);
        }

        // Keyboard support — needs the container to be focusable.
        container.tabIndex = 0;
        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault(); stopPlay(); goTo(index - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault(); stopPlay(); goTo(index + 1);
            } else if (e.key === ' ') {
                e.preventDefault(); togglePlay();
            }
        });

        update();

        function makeBtn(label, title, onClick) {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'd2-slides__btn';
            b.textContent = label;
            b.title = title;
            b.setAttribute('aria-label', title);
            b.addEventListener('click', onClick);
            return b;
        }

        function goTo(i) {
            // Clamp at edges — matches CodeIntuition.io behaviour.
            const next = Math.max(0, Math.min(frames.length - 1, i));
            if (next === index) {
                update();
                return;
            }
            frames[index].classList.remove(ACTIVE_CLASS);
            index = next;
            frames[index].classList.add(ACTIVE_CLASS);
            update();
        }

        function update() {
            counter.textContent = `${index + 1} of ${frames.length}`;
            prevBtn.disabled = index === 0;
            nextBtn.disabled = index === frames.length - 1;
        }

        function togglePlay() {
            if (playTimer) {
                stopPlay();
                return;
            }
            // If we're at the end, restart from the beginning.
            if (index === frames.length - 1) {
                goTo(0);
            }
            playBtn.textContent = '⏸';
            playBtn.title = 'Pause';
            playBtn.setAttribute('aria-label', 'Pause');
            playTimer = setInterval(() => {
                if (index === frames.length - 1) {
                    stopPlay();
                    return;
                }
                goTo(index + 1);
            }, FRAME_INTERVAL_MS);
        }

        function stopPlay() {
            if (!playTimer) return;
            clearInterval(playTimer);
            playTimer = null;
            playBtn.textContent = '▶';
            playBtn.title = 'Play';
            playBtn.setAttribute('aria-label', 'Play');
        }
    }

    function run() {
        document.querySelectorAll('.d2-slides').forEach(init);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();
