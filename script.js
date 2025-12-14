// Central site script: year, nav toggle, theme toggle, and project filters
document.addEventListener('DOMContentLoaded', function () {
  // Year
  try {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  } catch (e) {}

  // Nav toggle (header)
  (function () {
    const btn = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.main-nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  })();

  // Theme toggle (shared)
  (function () {
    const checkbox = document.getElementById('checkbox');
    const html = document.documentElement;
    const icon = document.querySelector('.label .icon');
    if (!checkbox || !icon) return;

    // Load saved preference or use system preference
    let savedMode = null;
    try { savedMode = localStorage.getItem('theme-mode'); } catch (e) { savedMode = null; }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode = savedMode ? savedMode === 'dark' : prefersDark;

    function applyTheme(dark) {
      if (dark) {
        html.classList.add('dark-mode');
        checkbox.checked = true;
        icon.textContent = '🌙';
      } else {
        html.classList.remove('dark-mode');
        checkbox.checked = false;
        icon.textContent = '☀️';
      }
    }

    applyTheme(isDarkMode);

    checkbox.addEventListener('change', () => {
      const isDark = checkbox.checked;
      applyTheme(isDark);
      try { localStorage.setItem('theme-mode', isDark ? 'dark' : 'light'); } catch (e) {}
    });

    // If system preference changes and user has not saved a preference, follow it
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener ? mq.addEventListener('change', e => {
        try {
          const stored = localStorage.getItem('theme-mode');
          if (!stored) applyTheme(e.matches);
        } catch (err) {}
      }) : mq.addListener(e => {
        try {
          const stored = localStorage.getItem('theme-mode');
          if (!stored) applyTheme(e.matches);
        } catch (err) {}
      });
    }
  })();

  // Projects filter (only present on projects.html)
  (function () {
    const buttons = document.querySelectorAll('.filter-btn');
    if (!buttons || buttons.length === 0) return;
    const cards = document.querySelectorAll('.project-card');
    buttons.forEach(btn => btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      cards.forEach(card => {
        if (filter === '*' || card.dataset.tags.includes(filter)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }));
  })();
});
