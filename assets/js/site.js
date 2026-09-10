(() => {
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const sticky = document.querySelector('[data-sticky-cta]');
  const hero = document.querySelector('[data-hero]');

  const closeMenu = () => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', document.documentElement.lang === 'ja' ? 'メニューを開く' : 'Open menu');
    mobileMenu.hidden = true;
    document.body.classList.remove('menu-open');
  };

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      if (open) {
        closeMenu();
      } else {
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', document.documentElement.lang === 'ja' ? 'メニューを閉じる' : 'Close menu');
        mobileMenu.hidden = false;
        document.body.classList.add('menu-open');
      }
    });

    mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  }

  if (sticky && hero && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver(([entry]) => {
      sticky.classList.toggle('is-visible', !entry.isIntersecting && window.innerWidth < 980);
    }, { threshold: 0.08 });
    heroObserver.observe(hero);

    const footer = document.querySelector('.site-footer');
    if (footer) {
      const footerObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) sticky.classList.remove('is-visible');
      }, { threshold: 0.05 });
      footerObserver.observe(footer);
    }
  }

  // Analytics hook. GA4/GTM can subscribe to this data layer at launch.
  window.dataLayer = window.dataLayer || [];
  document.querySelectorAll('[data-track]').forEach((el) => {
    el.addEventListener('click', () => {
      window.dataLayer.push({
        event: el.dataset.track,
        source_section: el.dataset.source || 'unknown',
        language: document.documentElement.lang,
        page: window.location.pathname,
        destination: el.href || null
      });
    });
  });
})();
