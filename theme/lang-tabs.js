'use strict';

(function langTabs() {
    const LANG_DISPLAY = {
        c:          '⚙️ C',
        cpp:        '⚙️ C++',
        java:       '☕ Java',
        scala:      '⚡ Scala',
        javascript: '🟨 JavaScript',
        typescript: '🟦 TypeScript',
        python:     '🐍 Python',
        go:         '🐹 Go',
        kotlin:     '🎯 Kotlin',
        sql:        '🗃️ SQL',
        rust:       '🦀 Rust',
    };

    // Canonical tab order — tabs are always sorted by this list regardless of markdown order
    const LANG_ORDER = ['python', 'java', 'c', 'cpp', 'scala', 'javascript', 'typescript', 'go', 'kotlin', 'sql', 'rust'];

    const STORAGE_KEY = 'mdbook-lang-tab-preference';

    function getLang(block) {
        if (block.classList && block.classList.contains('playground')) {
            return 'rust';
        }

        const code = block.querySelector('code');
        if (!code) return null;
        for (const cls of code.classList) {
            const m = cls.match(/^language-(.+)$/);
            if (m) return m[1].toLowerCase();
        }
        return null;
    }

    function displayName(lang) {
        return LANG_DISPLAY[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
    }

    function readPref() {
        try { return localStorage.getItem(STORAGE_KEY) || 'python'; } catch (_) { return 'python'; }
    }

    function savePref(lang) {
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
    }

    function activateTab(container, lang) {
        container.querySelectorAll('.lang-tabs__tab').forEach(btn => {
            const on = btn.dataset.lang === lang;
            btn.classList.toggle('lang-tabs__tab--active', on);
            btn.setAttribute('aria-selected', String(on));
        });
        container.querySelectorAll('.lang-tabs__pane').forEach(pane => {
            pane.style.display = pane.dataset.lang === lang ? '' : 'none';
        });
    }

    function syncAll(source, lang) {
        document.querySelectorAll('.lang-tabs[data-initialized]').forEach(c => {
            if (c === source) return;
            if (c.querySelector(`.lang-tabs__tab[data-lang="${lang}"]`)) {
                activateTab(c, lang);
            }
        });
    }

    function init(container) {
        // Collect direct code-block children. Most languages render as <pre>,
        // while mdBook's native Rust playground renders as <div class="playground">.
        const blocks = Array.from(container.children).filter(el => {
            if (el.classList.contains('lang-tabs__bar') || el.classList.contains('lang-tabs__pane')) {
                return false;
            }
            return el.tagName === 'PRE' || el.classList.contains('playground');
        });

        // Need at least 2 code blocks to bother with a tab UI
        if (blocks.length <= 1) return;

        let items = blocks
            .map(block => ({ block, lang: getLang(block) }))
            .filter(x => x.lang !== null);

        if (items.length <= 1) return;

        // Sort tabs by canonical order; unknown languages go to the end in document order
        items.sort((a, b) => {
            const ai = LANG_ORDER.indexOf(a.lang);
            const bi = LANG_ORDER.indexOf(b.lang);
            if (ai === -1 && bi === -1) return 0;
            if (ai === -1) return 1;
            if (bi === -1) return -1;
            return ai - bi;
        });

        // Wrap each block in a pane div — in-place replacement preserves Ace editor bindings
        // because the underlying editor/code DOM node identity is unchanged.
        items.forEach(({ block, lang }) => {
            const pane = document.createElement('div');
            pane.className = 'lang-tabs__pane';
            pane.dataset.lang = lang;
            container.insertBefore(pane, block);
            pane.appendChild(block);
        });

        // Build the tab bar
        const bar = document.createElement('div');
        bar.className = 'lang-tabs__bar';
        bar.setAttribute('role', 'tablist');

        items.forEach(({ lang }) => {
            const btn = document.createElement('button');
            btn.className = 'lang-tabs__tab';
            btn.dataset.lang = lang;
            btn.textContent = displayName(lang);
            btn.setAttribute('role', 'tab');
            btn.setAttribute('type', 'button');
            btn.setAttribute('aria-selected', 'false');
            bar.appendChild(btn);
        });

        container.insertBefore(bar, container.firstChild);

        // Determine initial active tab — prefer stored language, fall back to first
        const pref  = readPref();
        const langs = items.map(x => x.lang);
        const initial = langs.includes(pref) ? pref : langs[0];
        activateTab(container, initial);

        // Wire up click handler
        bar.addEventListener('click', e => {
            const btn = e.target.closest('.lang-tabs__tab');
            if (!btn) return;
            const lang = btn.dataset.lang;
            activateTab(container, lang);
            savePref(lang);
            syncAll(container, lang);
        });

        container.dataset.initialized = 'true';
    }

    document.querySelectorAll('div.lang-tabs').forEach(init);
})();
