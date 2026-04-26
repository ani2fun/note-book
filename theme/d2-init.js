// Render `pre > code.language-d2` blocks as SVG via the kroki.io rendering service.
// Mirrors the mermaid-init.js pattern so D2 diagrams behave the same as mermaid ones.
// Swap KROKI_URL to a self-hosted kroki instance if desired.

const KROKI_URL = "https://kroki.io/d2/svg";

async function renderOneD2Block(codeBlock) {
    const pre = codeBlock.parentElement;
    if (!pre || pre.dataset.d2Processed === "true") {
        return;
    }
    pre.dataset.d2Processed = "true";

    const source = codeBlock.textContent;

    const container = document.createElement("div");
    container.className = "d2";
    container.textContent = "Rendering D2 diagram…";
    pre.replaceWith(container);

    try {
        const response = await fetch(KROKI_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: source,
        });

        if (!response.ok) {
            const detail = await response.text().catch(() => "");
            throw new Error(`HTTP ${response.status}${detail ? ` — ${detail}` : ""}`);
        }

        container.innerHTML = await response.text();
    } catch (error) {
        container.classList.add("d2--error");
        container.textContent = "";

        const heading = document.createElement("strong");
        heading.textContent = `D2 render error: ${error.message}`;
        container.appendChild(heading);

        const sourcePre = document.createElement("pre");
        sourcePre.textContent = source;
        container.appendChild(sourcePre);
    }
}

function renderD2Diagrams() {
    const blocks = document.querySelectorAll("pre > code.language-d2");
    Promise.all(Array.from(blocks).map(renderOneD2Block));
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderD2Diagrams, { once: true });
} else {
    renderD2Diagrams();
}
