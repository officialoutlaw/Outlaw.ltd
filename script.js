/* =========================================================================
   OUTLAW.LTD — Vanilla JavaScript
   No frameworks. No dependencies. Just JS.
   ========================================================================= */
(function () {
  'use strict';

  /* ----- Gallery Data ----- */
  var GALLERY_IMAGES = [
    { src: '1-photo.jpg', alt: 'Outlaw.ltd' },
    { src: '2-photo.jpg', alt: 'Sanatan X Logo' },
    { src: '3-photo.jpg', alt: 'Mahadev Adiyogi' },
    { src: '4-photo.jpg', alt: 'Shiv Shambhu' },
    { src: '5-photo.jpg', alt: 'Hinduism' },
    { src: '6-photo.jpg', alt: 'Shiv Sanatan' },
  ];

  var STORAGE_KEY = 'outlaw-theme';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- Theme Toggle ----- */
  function getInitialTheme() {
    var stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    var root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    var toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(function (t) {
      t.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
      t.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  function toggleTheme() {
    var isDark = document.documentElement.classList.contains('dark');
    var next = isDark ? 'light' : 'dark';
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {}
  }

  applyTheme(getInitialTheme());

  document.querySelectorAll('.theme-toggle').forEach(function (toggle) {
    toggle.addEventListener('click', toggleTheme);
  });

  /* ----- Navbar Scroll Effect ----- */
  var navbar = document.getElementById('navbar');
  var backToTop = document.getElementById('backToTop');

  var lastScrolled = false;
  var lastShowTop = false;

  function onScroll() {
    var y = window.scrollY;
    var scrolled = y > 24;
    var showTop = y > 600;

    if (scrolled !== lastScrolled) {
      navbar.classList.toggle('scrolled', scrolled);
      lastScrolled = scrolled;
    }

    if (showTop !== lastShowTop) {
      backToTop.classList.toggle('visible', showTop);
      backToTop.hidden = !showTop;
      lastShowTop = showTop;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ----- Mobile Menu ----- */
  var menuToggle = document.getElementById('menuToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  function openMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', openMenu);

  document.querySelectorAll('[data-close-menu]').forEach(function (el) {
    el.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  /* ----- Scroll Reveal (IntersectionObserver) ----- */
  function initReveal() {
    var elements = document.querySelectorAll('.reveal, .reveal-stagger');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  initReveal();

  /* ----- Gallery Lightbox ----- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var currentLightboxIndex = 0;

  function openLightbox(index) {
    currentLightboxIndex = index;
    var image = GALLERY_IMAGES[index];
    lightboxImg.src = image.src;
    lightboxImg.alt = image.alt;
    lightboxCaption.textContent = image.alt + ' — ' + (index + 1) + ' / ' + GALLERY_IMAGES.length;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    var len = GALLERY_IMAGES.length;
    currentLightboxIndex = (currentLightboxIndex + direction + len) % len;
    var image = GALLERY_IMAGES[currentLightboxIndex];
    lightboxImg.src = image.src;
    lightboxImg.alt = image.alt;
    lightboxCaption.textContent = image.alt + ' — ' + (currentLightboxIndex + 1) + ' / ' + len;
  }

  document.querySelectorAll('.gallery-item').forEach(function (item) {
    item.addEventListener('click', function () {
      var index = parseInt(item.getAttribute('data-index'), 10);
      openLightbox(index);
    });
  });

  document.querySelectorAll('[data-lightbox-close]').forEach(function (el) {
    el.addEventListener('click', closeLightbox);
  });

  document.getElementById('lightboxPrev').addEventListener('click', function (e) {
    e.stopPropagation();
    navigateLightbox(-1);
  });

  document.getElementById('lightboxNext').addEventListener('click', function (e) {
    e.stopPropagation();
    navigateLightbox(1);
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigateLightbox(1);
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
  });

  /* ----- Contact Form Validation ----- */
  var form = document.getElementById('contactForm');
  var submitBtn = document.getElementById('submitBtn');
  var btnText = submitBtn.querySelector('.btn-text');
  var btnIconSend = submitBtn.querySelector('.btn-icon-send');
  var formSuccess = document.getElementById('formSuccess');
  var formErrorBanner = document.getElementById('formErrorBanner');

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var touched = { name: false, email: false, message: false };

  function validateField(name, value) {
    value = value.trim();
    if (name === 'name') {
      if (!value) return 'Please enter your name.';
      if (value.length < 2) return 'Name must be at least 2 characters.';
    }
    if (name === 'email') {
      if (!value) return 'Please enter your email.';
      if (!EMAIL_RE.test(value)) return 'Please enter a valid email address.';
    }
    if (name === 'message') {
      if (!value) return 'Please enter a message.';
      if (value.length < 10) return 'Message must be at least 10 characters.';
    }
    return '';
  }

  function showError(name, message) {
    var input = document.getElementById(name);
    var errorEl = document.getElementById(name + '-error');
    if (message) {
      input.classList.add('error');
      input.setAttribute('aria-invalid', 'true');
      errorEl.textContent = message;
    } else {
      input.classList.remove('error');
      input.removeAttribute('aria-invalid');
      errorEl.textContent = '';
    }
  }

  function validateAll() {
    var values = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value,
    };
    var hasError = false;
    Object.keys(values).forEach(function (field) {
      var error = validateField(field, values[field]);
      showError(field, error);
      if (error) hasError = true;
    });
    return hasError;
  }

  ['name', 'email', 'message'].forEach(function (fieldName) {
    var input = document.getElementById(fieldName);
    input.addEventListener('input', function () {
      if (touched[fieldName]) {
        showError(fieldName, validateField(fieldName, input.value));
      }
    });
    input.addEventListener('blur', function () {
      touched[fieldName] = true;
      showError(fieldName, validateField(fieldName, input.value));
    });
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    formSuccess.hidden = true;
    formErrorBanner.hidden = true;

    touched = { name: true, email: true, message: true };
    var hasError = validateAll();

    if (hasError) {
      formErrorBanner.hidden = false;
      return;
    }

    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';
    btnIconSend.outerHTML = '<span class="spinner" id="submitSpinner"></span>';

    try {
      var response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error('Submission failed');

      formSuccess.hidden = false;
      form.reset();
      touched = { name: false, email: false, message: false };
      ['name', 'email', 'message'].forEach(function (f) { showError(f, ''); });
    } catch (error) {
      formErrorBanner.textContent = 'Unable to send your message right now. Please try again or email us directly.';
      formErrorBanner.hidden = false;
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = 'Send Message';
      var spinner = document.getElementById('submitSpinner');
      if (spinner) {
        spinner.outerHTML = '<svg class="btn-icon-send" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
      }
    }
  });

  /* ----- Footer Year ----- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
