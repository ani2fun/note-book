// Inject extra theme entries into mdbook's theme picker.
// mdbook delegates clicks on `#mdbook-theme-list .theme` and strips
// the `mdbook-theme-` prefix from the button id to derive the class
// applied to <html>. So button id `mdbook-theme-dracula` => class `dracula`.

(function () {
    const EXTRA_THEMES = [
        { cls: "polar-night",     label: "Polar Night" },
        { cls: "snow-storm",      label: "Snow Storm" },
        { cls: "dracula",         label: "Dracula" },
        { cls: "solarized-light", label: "Solarized Light" },
        { cls: "solarized-dark",  label: "Solarized Dark" },
        { cls: "gruvbox-dark",    label: "Gruvbox Dark" },
    ];

    function inject() {
        const list = document.getElementById("mdbook-theme-list");
        if (!list) return false;

        for (const t of EXTRA_THEMES) {
            const id = "mdbook-theme-" + t.cls;
            if (document.getElementById(id)) continue;

            const li = document.createElement("li");
            li.setAttribute("role", "none");

            const btn = document.createElement("button");
            btn.setAttribute("role", "menuitem");
            btn.className = "theme";
            btn.id = id;
            btn.textContent = t.label;

            li.appendChild(btn);
            list.appendChild(li);
        }
        return true;
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", inject, { once: true });
    } else {
        inject();
    }
})();
