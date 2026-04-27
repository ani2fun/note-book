// Toggle a `.scrolled` class on <body> once the reader has scrolled past
// a small threshold. Used by theme/custom.css to fade in the floating
// prev/next chapter chevrons (.nav-wide-wrapper).

(function () {
  const THRESHOLD = 200;

  function update() {
    const past = window.scrollY > THRESHOLD;
    document.body.classList.toggle('scrolled', past);
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('load', update);
})();
