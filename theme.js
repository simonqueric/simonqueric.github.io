(() => {
  const root = document.documentElement;
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  let saved = null;
  try { saved = localStorage.getItem('academic-color-mode'); } catch (_) {}
  let explicit = saved === 'dark' || saved === 'light';
  function apply(mode) {
    root.dataset.mode = mode;
    const toggle = document.getElementById('mode-toggle');
    if (toggle) {
      toggle.hidden = false;
      toggle.setAttribute('aria-checked', String(mode === 'dark'));
    }
  }
  apply(explicit ? saved : preference.matches ? 'dark' : 'light');
  document.addEventListener('DOMContentLoaded', () => {
    apply(root.dataset.mode);
    document.getElementById('mode-toggle').addEventListener('click', () => {
      const mode = root.dataset.mode === 'dark' ? 'light' : 'dark';
      explicit = true;
      apply(mode);
      try { localStorage.setItem('academic-color-mode', mode); } catch (_) {}
    });
  });
  preference.addEventListener('change', event => {
    if (!explicit) apply(event.matches ? 'dark' : 'light');
  });
})();
