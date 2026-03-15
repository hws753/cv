document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.site-nav');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const revealItems = document.querySelectorAll('.reveal');
  const statValues = document.querySelectorAll('.stat-value');
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setHeaderState = () => {
    if (window.scrollY > 24) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };

  const closeMenu = () => {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  const openMenu = () => {
    if (!navMenu || !navToggle) return;
    navMenu.classList.add('open');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      const offset = header ? header.offsetHeight - 2 : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: 'smooth' });
      closeMenu();
    });
  });

  const setActiveLink = () => {
    const currentY = window.scrollY + (header ? header.offsetHeight + 120 : 120);

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const id = `#${section.id}`;
      const matchedLink = navLinks.find((link) => link.getAttribute('href') === id);

      if (!matchedLink) return;

      if (currentY >= sectionTop && currentY < sectionBottom) {
        navLinks.forEach((navLink) => navLink.classList.remove('active'));
        matchedLink.classList.add('active');
      }
    });
  };

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));

    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const counter = entry.target;
          const target = Number(counter.dataset.target || '0');
          const duration = 1300;
          const startTime = performance.now();

          const animateCounter = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(target * eased).toLocaleString('en-US');

            if (progress < 1) {
              requestAnimationFrame(animateCounter);
            } else {
              counter.textContent = target.toLocaleString('en-US');
            }
          };

          requestAnimationFrame(animateCounter);
          observer.unobserve(counter);
        });
      },
      {
        threshold: 0.55,
      }
    );

    statValues.forEach((counter) => counterObserver.observe(counter));
  } else {
    revealItems.forEach((item) => item.classList.add('reveal-visible'));
    statValues.forEach((counter) => {
      const target = Number(counter.dataset.target || '0');
      counter.textContent = target.toLocaleString('en-US');
    });
  }

  window.addEventListener('scroll', () => {
    setHeaderState();
    setActiveLink();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  setHeaderState();
  setActiveLink();
});
