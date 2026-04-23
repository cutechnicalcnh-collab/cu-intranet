/* ========================
   CU INTRANET — SCRIPTS
   ======================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Topbar scroll effect ── */
  const topbar = document.getElementById('topbar');
  window.addEventListener('scroll', () => {
    topbar.classList.toggle('scrolled', window.scrollY > 10);
  });

  /* ── Theme toggle ── */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon   = document.getElementById('theme-icon');
  const moonSVG = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
  const sunSVG  = `<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>`;

  let darkMode = localStorage.getItem('cu-dark-mode') === 'true';
  const applyTheme = () => {
    document.body.classList.toggle('dark-mode', darkMode);
    themeIcon.innerHTML = darkMode ? sunSVG : moonSVG;
  };
  applyTheme();

  themeToggle.addEventListener('click', () => {
    darkMode = !darkMode;
    localStorage.setItem('cu-dark-mode', darkMode);
    applyTheme();
  });

  /* ── Subnav active link ── */
  const subnavLinks = document.querySelectorAll('.subnav-link');
  subnavLinks.forEach(link => {
    link.addEventListener('click', () => {
      subnavLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  /* ── Counter animation ── */
  const counters = document.querySelectorAll('.stat-num');
  let countStarted = false;

  const formatNum = (n) => n >= 1000 ? (n / 1000).toFixed(0) + 'K+' : n + '+';

  const startCounters = () => {
    if (countStarted) return;
    countStarted = true;
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const duration = 1800;
      const step = Math.ceil(target / (duration / 16));
      let current = 0;
      const tick = () => {
        current = Math.min(current + step, target);
        counter.textContent = formatNum(current);
        if (current < target) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };

  const heroStatsBar = document.getElementById('hero-stats-bar');
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) startCounters();
  }, { threshold: 0.5 });
  if (heroStatsBar) statsObserver.observe(heroStatsBar);

  /* ── Scroll reveal ── */
  const reveals = document.querySelectorAll(
    '.feature-card, .event-card, .club-card, .achievement-card, .section-header'
  );
  reveals.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => revealObserver.observe(el));

  /* ── Event filter tabs ── */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const eventCards = document.querySelectorAll('.event-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;

      eventCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter.toLowerCase();
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        if (match) {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
          card.style.display = '';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            if (tab.classList.contains('active') && filter !== 'all' && card.dataset.category !== filter.toLowerCase()) {
              card.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  });

  /* ── Achievements tabs ── */
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.querySelector(`[data-panel="${btn.dataset.tab}"]`).classList.add('active');
    });
  });

  /* ── Search input effect ── */
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = searchInput.value.trim();
        if (q) {
          // Highlight: shake the input
          searchInput.style.borderColor = 'var(--red-400)';
          setTimeout(() => { searchInput.style.borderColor = ''; }, 1200);
        }
      }
    });
  }

  /* ── Login form ── */
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = document.getElementById('signin-btn');
      btn.textContent = 'Signing in...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Sign In';
        btn.disabled = false;
      }, 2000);
    });
  }

  /* ── Smooth hero parallax ── */
  const heroBg = document.getElementById('hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.3}px)`;
    }, { passive: true });
  }

  /* ── Subnav link activation on scroll ── */
  const sections = [
    { id: 'hero-section',         link: 'nav-home' },
    { id: 'clubs-section',        link: 'nav-clubs' },
    { id: 'stats-section',        link: 'nav-communities' },
    { id: 'events-section',       link: 'nav-professional' },
  ];

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const match = sections.find(s => s.id === entry.target.id);
        if (match) {
          subnavLinks.forEach(l => l.classList.remove('active'));
          const activeLink = document.getElementById(match.link);
          if (activeLink) activeLink.classList.add('active');
        }
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) sectionObserver.observe(el);
  });

});
