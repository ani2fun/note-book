// Wraps the pagetoc nav in a collapsible <details> element on narrow
// viewports so phone/tablet readers get a quick "On this page" jump
// list above the lesson content. On wide viewports (>=1440px) the
// pagetoc keeps its desktop right-rail layout — we unwrap if the user
// resizes from narrow to wide.

(function () {
  const NARROW = window.matchMedia('(max-width: 1439px)');
  const SUMMARY_TEXT = 'On this page';

  function findSidetoc() {
    return document.querySelector('.sidetoc');
  }

  function isWrapped(sidetoc) {
    return sidetoc && sidetoc.firstElementChild &&
      sidetoc.firstElementChild.classList.contains('pagetoc-mobile');
  }

  function wrap(sidetoc) {
    const pagetoc = sidetoc.querySelector('.pagetoc');
    if (!pagetoc || !pagetoc.children.length || isWrapped(sidetoc)) return;

    const details = document.createElement('details');
    details.className = 'pagetoc-mobile';

    const summary = document.createElement('summary');
    summary.textContent = SUMMARY_TEXT;
    details.appendChild(summary);
    details.appendChild(pagetoc);

    sidetoc.appendChild(details);
  }

  function unwrap(sidetoc) {
    if (!isWrapped(sidetoc)) return;
    const details = sidetoc.firstElementChild;
    const pagetoc = details.querySelector('.pagetoc');
    if (pagetoc) sidetoc.appendChild(pagetoc);
    details.remove();
  }

  function sync() {
    const sidetoc = findSidetoc();
    if (!sidetoc) return;
    if (NARROW.matches) wrap(sidetoc);
    else unwrap(sidetoc);
  }

  // pagetoc.js populates .pagetoc on window load; run after.
  window.addEventListener('load', () => {
    // Wait one tick so pagetoc.js's load handler completes first.
    setTimeout(sync, 0);
  });

  NARROW.addEventListener('change', sync);
})();
