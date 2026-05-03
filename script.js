// Mark JS as available
document.documentElement.classList.add('js');

// Initialize scroll reveal animations
document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.reveal');
  const nav = document.querySelector('nav');
  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
  const progressBar = document.querySelector('.scroll-progress span');
  const backToTopButton = document.querySelector('.back-to-top');
  const sectionElements = Array.from(document.querySelectorAll('section[id]'));

  // Fallback for browsers without IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('is-visible'));
    if (backToTopButton) {
      backToTopButton.classList.add('is-visible');
    }
    return;
  }

  // Create observer for scroll reveals
  const observer = new IntersectionObserver((entries, intersectionObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('is-visible');
      intersectionObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.18,
    rootMargin: '0px 0px -8% 0px'
  });

  // Observe all reveal elements
  revealElements.forEach((element) => {
    observer.observe(element);
  });

  const setActiveLink = (activeId) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${activeId}`;
      link.classList.toggle('is-active', isActive);
    });
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      setActiveLink(entry.target.id);
    });
  }, {
    threshold: 0.45,
    rootMargin: '-18% 0px -45% 0px'
  });

  sectionElements.forEach((section) => sectionObserver.observe(section));

  const updateScrollUI = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = documentHeight > 0 ? scrollTop / documentHeight : 0;

    if (progressBar) {
      progressBar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
    }

    if (nav) {
      nav.classList.toggle('is-scrolled', scrollTop > 24);
    }

    if (backToTopButton) {
      backToTopButton.classList.toggle('is-visible', scrollTop > 500);
    }
  };

  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();

  if (backToTopButton) {
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
