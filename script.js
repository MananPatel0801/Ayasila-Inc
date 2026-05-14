/**
 * AYASILA INC. — SCRIPT
 * script.js
 *
 * Sections:
 * 1. Theme Toggle (Light / Dark)
 * 2. Navbar: Scroll Shadow + Active Link
 * 3. Hamburger Mobile Menu
 * 4. Scroll Reveal (IntersectionObserver)
 * 5. Contact Form — Success Message
 */


/* =============================================
   1. THEME TOGGLE
   Stores preference in a JS variable (not localStorage).
   Toggles class "dark-mode" on <html>.
   Swaps hero logo src on toggle.
============================================= */
(function () {
  // JS-only state variable — no localStorage
  let isDarkMode = false;

  // Logo sources
  const LOGO_LIGHT = 'assets/images/logo-full-light.png';
  const LOGO_DARK  = 'assets/images/logo-full-dark.png';

  const html        = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const heroLogo    = document.getElementById('heroLogo');

  /**
   * Apply the current theme state to the DOM.
   */
  function applyTheme() {
    if (isDarkMode) {
      html.classList.add('dark-mode');
      // Sun icon — click to return to light
      themeToggle.querySelector('.theme-toggle__icon').textContent = '☀';
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
      // Swap hero logo to transparent/dark version
      if (heroLogo) {
        heroLogo.src = LOGO_DARK;
        heroLogo.alt = 'Ayasila Inc. full logo (dark mode)';
      }
    } else {
      html.classList.remove('dark-mode');
      // Moon icon — click to go dark
      themeToggle.querySelector('.theme-toggle__icon').textContent = '☾';
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
      // Swap hero logo to light background version
      if (heroLogo) {
        heroLogo.src = LOGO_LIGHT;
        heroLogo.alt = 'Ayasila Inc. full logo';
      }
    }
  }

  // Toggle on button click
  themeToggle.addEventListener('click', function () {
    isDarkMode = !isDarkMode;
    applyTheme();
  });

  // Set initial state (light mode default)
  applyTheme();
})();


/* =============================================
   2. NAVBAR — SCROLL SHADOW + MOBILE CLOSE ON LINK CLICK
   Adds class "scrolled" to navbar when page scrolled > 60px.
============================================= */
(function () {
  const navbar = document.getElementById('navbar');

  function handleScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Throttle scroll handler for performance
  let ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Run once on load in case page is already scrolled
  handleScroll();
})();


/* =============================================
   3. HAMBURGER MOBILE MENU
   Toggles mobile-menu open/close.
   Closes menu when a nav link is clicked.
   Updates aria-expanded for accessibility.
============================================= */
(function () {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu   = document.getElementById('mobileMenu');
  const mobileLinks  = mobileMenu.querySelectorAll('.mobile-menu__link');

  function openMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    hamburgerBtn.querySelector('span').textContent = '✕';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.querySelector('span').textContent = '☰';
  }

  // Toggle on hamburger click
  hamburgerBtn.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close menu when any nav link is clicked
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (!hamburgerBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMenu();
    }
  });
})();


/* =============================================
   4. SCROLL REVEAL — IntersectionObserver
   Observes all elements with class "section".
   When they enter the viewport, adds class "visible".
   CSS handles the opacity + translateY transition.
============================================= */
(function () {
  // If the browser doesn't support IntersectionObserver,
  // just make all sections visible immediately.
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.section').forEach(function (el) {
      el.classList.add('visible');
    });
    return;
  }

  const observerOptions = {
    root:       null,      // viewport
    rootMargin: '0px 0px -60px 0px',  // trigger slightly before bottom edge
    threshold:  0.1        // 10% of section visible
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after reveal — no need to re-run
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe every section
  document.querySelectorAll('.section').forEach(function (section) {
    observer.observe(section);
  });
})();


/* =============================================
   5. CONTACT FORM — SUCCESS MESSAGE
   Intercepts form submit, shows success div,
   and hides the form.
   The mailto action is a placeholder — replace
   with a real backend before going live.
============================================= */
(function () {
  const form        = document.getElementById('contactForm');
  const successMsg  = document.getElementById('formSuccess');

  if (!form || !successMsg) return;

  form.addEventListener('submit', function (e) {
    // Basic HTML5 validation check
    if (!form.checkValidity()) {
      // Let the browser show native validation messages
      return;
    }

    // Prevent the mailto redirect for a smoother UX.
    // Remove the line below if you want the actual mailto to fire.
    e.preventDefault();

    // Hide the form and show the success message
    form.style.display = 'none';
    successMsg.classList.add('visible');

    // Scroll success message into view
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
})();
