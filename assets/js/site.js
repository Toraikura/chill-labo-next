(() => {
  const en = document.documentElement.lang === 'en';
  const menu = document.querySelector('.mobile-menu');
  const menuButton = menu?.querySelector('summary');
  const closeMenu = (restoreFocus = false) => {
    if (!menu?.open) return;
    menu.open = false;
    if (restoreFocus) menuButton.focus();
  };
  menu?.addEventListener('toggle', () => {
    menuButton.setAttribute('aria-label', menu.open ? (en ? 'Close menu' : 'メニューを閉じる') : (en ? 'Open menu' : 'メニューを開く'));
  });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('click', event => { if (!menu?.contains(event.target)) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(true); });
  document.querySelectorAll('.language-link').forEach(link => {
    link.addEventListener('click', () => {
      const sections = [...document.querySelectorAll('main section[id]')];
      const headerBottom = document.querySelector('.site-header').getBoundingClientRect().bottom;
      const current = sections.map(section => {
        const rect = section.getBoundingClientRect();
        return { section, visible: Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, headerBottom)) };
      }).sort((a, b) => b.visible - a.visible)[0]?.section;
      link.hash = current ? current.id : '';
    });
  });
  const copyButton = document.querySelector('#copy-message');
  if (copyButton) {
    copyButton.hidden = false;
    copyButton.addEventListener('click', async () => {
      const message = document.querySelector('#dm-message');
      const status = document.querySelector('.copy-status');
      try {
        await navigator.clipboard.writeText(message.textContent);
        status.textContent = en ? 'Message copied. Add your date, time and party size before sending.' : 'コピーしました。日付・時間・人数を書き替えてお送りください。';
      } catch {
        const range = document.createRange();
        range.selectNodeContents(message);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        status.textContent = en ? 'Please select and copy the message above.' : '上のメッセージを選択してコピーしてください。';
      }
    });
  }
  const sticky = document.querySelector('.sticky-actions');
  const strip = document.querySelector('.service-strip');
  const mobile = window.matchMedia('(max-width: 900px)');
  const visibleActions = new Set();
  let passedStrip = false;
  const updateSticky = () => {
    if (sticky) sticky.hidden = !mobile.matches || !passedStrip || visibleActions.size > 0 || menu?.open;
  };
  if (sticky && strip && 'IntersectionObserver' in window) {
    const actionObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visibleActions.add(entry.target);
        else visibleActions.delete(entry.target);
      }
      updateSticky();
    }, { threshold: 0 });
    document.querySelectorAll('.inline-actions').forEach(target => actionObserver.observe(target));
    const stripObserver = new IntersectionObserver(entries => {
      passedStrip = entries[0].boundingClientRect.bottom <= 0;
      updateSticky();
    }, { threshold: 0 });
    stripObserver.observe(strip);
    mobile.addEventListener('change', updateSticky);
    menu?.addEventListener('toggle', updateSticky);
  }
  // Optional analytics integration: these are outbound clicks, never completed bookings.
  // No analytics service, cookies or network tracking is loaded by this site.
  document.querySelectorAll('[data-track]').forEach(link => {
    link.addEventListener('click', () => {
      if (Array.isArray(window.dataLayer)) window.dataLayer.push({event: link.dataset.track, language: en ? 'en' : 'ja', destination: link.href});
    });
  });
})();
