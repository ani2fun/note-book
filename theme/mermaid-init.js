function renderMermaidDiagrams() {
    if (!window.mermaid) {
        return;
    }

    const mermaidBlocks = document.querySelectorAll("pre > code.language-mermaid");

    for (const codeBlock of mermaidBlocks) {
        const pre = codeBlock.parentElement;
        if (!pre || pre.dataset.mermaidProcessed === "true") {
            continue;
        }

        const container = document.createElement("pre");
        container.className = "mermaid";
        container.textContent = codeBlock.textContent;
        container.dataset.mermaidProcessed = "true";
        pre.replaceWith(container);
    }

    window.mermaid.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        theme: document.documentElement.classList.contains("ayu") ||
            document.documentElement.classList.contains("navy")
            ? "dark"
            : "default",
        flowchart: {
            htmlLabels: true,
            useMaxWidth: true
        }
    });

    window.mermaid.run({
        querySelector: "pre.mermaid"
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderMermaidDiagrams, { once: true });
} else {
    renderMermaidDiagrams();
}
