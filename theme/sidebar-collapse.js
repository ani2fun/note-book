(function () {
    const STORAGE_KEY = "mdbook-sidebar-collapsed";

    function loadState() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        } catch (e) {
            return {};
        }
    }

    function saveState(state) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            // ignore storage failures
        }
    }

    function sectionKey(link) {
        return link.getAttribute("href") || link.textContent.trim();
    }

    function setCollapsed(titleItem, sectionList, button, collapsed) {
        titleItem.classList.toggle("is-collapsed", collapsed);
        sectionList.hidden = collapsed;
        button.setAttribute("aria-expanded", String(!collapsed));
        button.setAttribute("title", collapsed ? "Expand section" : "Collapse section");
    }

    function toggleSection(titleItem, sectionList, button, key, state) {
        const nextCollapsed = !titleItem.classList.contains("is-collapsed");
        setCollapsed(titleItem, sectionList, button, nextCollapsed);
        state[key] = nextCollapsed;
        saveState(state);
    }

    function enhanceSidebarTree(root) {
        const state = loadState();
        const sections = root.querySelectorAll("ol.section");

        sections.forEach((sectionList) => {
            if (sectionList.dataset.collapsibleEnhanced === "true") {
                return;
            }

            const wrapperItem = sectionList.parentElement;
            const titleItem = wrapperItem && wrapperItem.previousElementSibling;
            if (!titleItem || !titleItem.matches("li.chapter-item")) {
                return;
            }

            const titleLink = titleItem.querySelector(":scope > a");
            if (!titleLink) {
                return;
            }

            const toggle = document.createElement("button");
            toggle.type = "button";
            toggle.className = "sidebar-section-toggle";
            toggle.setAttribute("aria-label", "Toggle section");

            const key = sectionKey(titleLink);
            const hasActiveChild = !!sectionList.querySelector("a.active, li.chapter-item.active");
            const hasActiveTitle = titleLink.classList.contains("active");
            const collapsed = state[key] ?? !(hasActiveChild || hasActiveTitle);

            titleItem.classList.add("has-children");
            titleLink.insertAdjacentElement("afterend", toggle);
            setCollapsed(titleItem, sectionList, toggle, collapsed);

            toggle.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                toggleSection(titleItem, sectionList, toggle, key, state);
            });

            titleLink.addEventListener("click", function (event) {
                if (
                    event.defaultPrevented ||
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey ||
                    event.button !== 0
                ) {
                    return;
                }

                event.preventDefault();
                toggleSection(titleItem, sectionList, toggle, key, state);
            });

            sectionList.dataset.collapsibleEnhanced = "true";
        });
    }

    function enhanceAll() {
        const iframeBody = document.body && document.body.classList.contains("sidebar-iframe-inner")
            ? document.body
            : null;
        if (iframeBody) {
            enhanceSidebarTree(iframeBody);
        }

        const sidebar = document.getElementById("sidebar");
        if (sidebar) {
            enhanceSidebarTree(sidebar);
        }

        document.documentElement.classList.remove("sidebar-collapsible-loading");
    }

    document.addEventListener("DOMContentLoaded", function () {
        enhanceAll();

        const observer = new MutationObserver(function () {
            enhanceAll();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
})();
