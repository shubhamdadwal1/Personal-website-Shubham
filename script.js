const revealElements = document.querySelectorAll('.reveal');
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.nav a');
const sections = document.querySelectorAll('main section[id]');
const yearAnchor = document.querySelector('[data-year]');

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.16 }
);

revealElements.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 70, 350)}ms`;
  revealObserver.observe(element);
});

const closeNav = () => {
  if (!nav || !toggle) {
    return;
  }

  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
};

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

const navObserver = new IntersectionObserver(
  (entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleEntry) {
      return;
    }

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${visibleEntry.target.id}`;
      link.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  },
  {
    threshold: [0.2, 0.45, 0.7],
    rootMargin: '-15% 0px -45% 0px'
  }
);

sections.forEach((section) => navObserver.observe(section));

if (yearAnchor) {
  yearAnchor.textContent = new Date().getFullYear();
}
