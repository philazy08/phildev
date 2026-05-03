// Mark JS as available
document.documentElement.classList.add('js');

// Initialize scroll reveal animations
document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.reveal');

  // Fallback for browsers without IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('is-visible'));
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
});
