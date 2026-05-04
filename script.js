// Mark JS as available
document.documentElement.classList.add('js');

// Initialize scroll reveal animations
document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navBar = document.querySelector('nav');
  const scrollTargetsByHash = {
    '#about': null,
    '#skills': '.section-header',
    '#projects': '.section-header',
    '#pricing': '.section-header',
    '#contact': null
  };

  const scrollToNavTarget = (hash) => {
    const section = document.querySelector(hash);
    if (!section) return;

    const targetSelector = scrollTargetsByHash[hash];
    const target = targetSelector ? section.querySelector(targetSelector) : null;
    const scrollElement = target || section;
    const navHeight = navBar ? navBar.offsetHeight : 0;
    const top = scrollElement.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
  };
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const revealElements = document.querySelectorAll('.reveal');
  const nav = document.querySelector('nav');
  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
  const progressBar = document.querySelector('.scroll-progress span');
  const backToTopButton = document.querySelector('.back-to-top');
  const sectionElements = Array.from(document.querySelectorAll('section[id]'));
  const typingWord = document.querySelector('.hero-typing-word');
  const typingCursor = document.querySelector('.hero-typing-cursor');
  const typingSpacer = document.querySelector('.hero-typing-spacer');

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      if (!hash || !hash.startsWith('#')) return;

      event.preventDefault();

      if (navMenu) {
        navMenu.classList.remove('is-open');
      }
      if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
      }

      scrollToNavTarget(hash);
    });
  });

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

  // Hide scroll hint when hero is out of view
  const scrollHint = document.querySelector('.hero-scroll-hint');
  if (scrollHint) {
    const heroScrollObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        scrollHint.style.display = entry.isIntersecting ? 'flex' : 'none';
      });
    }, {
      threshold: 0
    });
    const hero = document.querySelector('.hero');
    if (hero) {
      heroScrollObserver.observe(hero);
    }
  }

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

  if (typingWord) {
    const words = (typingWord.getAttribute('data-typing-words') || '')
      .split(',')
      .map((word) => word.trim())
      .filter(Boolean);

    if (words.length > 0) {
      if (typingSpacer) {
        typingSpacer.textContent = words.reduce((longestWord, currentWord) => (
          currentWord.length > longestWord.length ? currentWord : longestWord
        ), words[0]);
      }

      let wordIndex = 0;
      let characterIndex = typingWord.textContent.length;
      let isDeleting = false;

      const typingDelay = 120;
      const deletingDelay = 70;
      const pauseAfterTyping = 1100;

      const animateTyping = () => {
        const currentWord = words[wordIndex];

        if (isDeleting) {
          characterIndex = Math.max(characterIndex - 1, 0);
          typingWord.textContent = currentWord.slice(0, characterIndex);
          if (typingCursor) {
            typingCursor.classList.toggle('is-hidden', characterIndex === 0);
            // Update cursor position
            updateCursorPosition();
          }

          if (characterIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            if (typingCursor) {
              typingCursor.classList.remove('is-hidden');
            }
            window.requestAnimationFrame(animateTyping);
            return;
          }

          window.setTimeout(animateTyping, deletingDelay);
          return;
        }

        characterIndex = Math.min(characterIndex + 1, currentWord.length);
        typingWord.textContent = currentWord.slice(0, characterIndex);
        if (typingCursor) {
          typingCursor.classList.toggle('is-hidden', characterIndex === currentWord.length);
          // Update cursor position
          updateCursorPosition();
        }

        if (characterIndex === currentWord.length) {
          isDeleting = true;
          window.setTimeout(animateTyping, pauseAfterTyping);
          return;
        }

        window.setTimeout(animateTyping, typingDelay);
      };

      const updateCursorPosition = () => {
        if (!typingWord || !typingCursor) return;
        const wordWidth = typingWord.offsetWidth;
        const offset = (wordWidth / 2);
        typingCursor.style.setProperty('--cursor-offset', offset + 'px');
      };

      window.setTimeout(() => {
        if (words.length > 0) {
          updateCursorPosition();
          animateTyping();
        }
      }, 900);
    }
  }
});
