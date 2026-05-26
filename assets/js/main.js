/**
 * BulkSend v1.1 - Main JavaScript
 * Company: JAAN Network Pvt Ltd
 */

'use strict';

/* ============================================================
   INIT ON DOM READY
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initActiveNav();
  initThemeToggle();
  initBackToTop();
  initCounters();
  initPricingToggle();
  initFormValidation();
  initAOS();
  initTooltips();
  initSmoothScroll();
  initMobileMenu();
});

/* ============================================================
   PAGE LOADER
   ============================================================ */

function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loaded');
      setTimeout(() => loader.remove(), 600);
    }, 400);
  });
}

/* ============================================================
   STICKY NAVBAR
   ============================================================ */

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ============================================================
   ACTIVE NAV LINK
   ============================================================ */

function initActiveNav() {
  const links = document.querySelectorAll('.navbar-nav .nav-link');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const linkPage = href.split('/').pop();

    if (
      linkPage === currentPath ||
      (currentPath === '' && linkPage === 'index.html') ||
      (currentPath === 'index.html' && linkPage === 'index.html')
    ) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ============================================================
   DARK / LIGHT MODE TOGGLE
   ============================================================ */

function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;

  const icon = toggleBtn.querySelector('i');
  const saved = localStorage.getItem('bulksend-theme') || 'dark';

  applyTheme(saved, icon);

  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next, icon);
    localStorage.setItem('bulksend-theme', next);
  });
}

function applyTheme(theme, icon) {
  document.documentElement.setAttribute('data-theme', theme);
  if (icon) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

/* ============================================================
   BACK TO TOP BUTTON
   ============================================================ */

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
      current += step;
      if (current < target) {
        el.textContent = Math.floor(current).toLocaleString() + suffix;
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* ============================================================
   PRICING TOGGLE (MONTHLY / YEARLY)
   ============================================================ */

function initPricingToggle() {
  const wrap = document.getElementById('pricingDurationWrap');
  if (!wrap) return;

  const saveBadge = document.getElementById('saveBadge');

  const base = {
    basic: 2900,
    pro: 5900,
    business: 9900
  };

  const formats = {
    monthly:  (v) => ({ amount: Math.round(v),            period: '/month',     permonth: null,                  save: null }),
    '6months':(v) => ({ amount: Math.round(v * 6 * 0.85), period: '/6 months',  permonth: Math.round(v * 0.85),  save: 'SAVE 15%' }),
    yearly:   (v) => ({ amount: Math.round(v * 12 * 0.7), period: '/year',      permonth: Math.round(v * 0.7),   save: 'SAVE 30%' }),
  };

  const labels = wrap.querySelectorAll('.pricing-toggle-label');

  function formatNumber(n) {
    return n.toLocaleString();
  }

  function update(duration) {
    Object.keys(base).forEach(key => {
      const val = formats[duration](base[key]);
      const amountEl   = document.getElementById(`price-${key}`);
      const periodEl   = document.getElementById(`period-${key}`);
      const permonthEl = document.getElementById(`permonth-${key}`);
      if (amountEl)   amountEl.textContent   = formatNumber(val.amount);
      if (periodEl)   periodEl.textContent   = val.period;
      if (permonthEl) permonthEl.textContent = val.permonth
        ? `≈ LKR ${formatNumber(val.permonth)}/mo effective`
        : '';
    });

    if (saveBadge) {
      const saveText = formats[duration](base.pro).save;
      if (saveText) {
        saveBadge.textContent = saveText;
        saveBadge.style.display = 'block';
      } else {
        saveBadge.style.display = 'none';
      }
    }
  }

  labels.forEach(lbl => {
    lbl.addEventListener('click', () => {
      labels.forEach(l => l.classList.remove('active'));
      lbl.classList.add('active');
      const dur = lbl.getAttribute('data-duration');
      update(dur);
    });
  });

  // initialize to monthly
  update('monthly');
}

/* ============================================================
   FORM VALIDATION
   ============================================================ */

function initFormValidation() {
  const handleNewsletterForm = (formId) => {
    const f = document.getElementById(formId);
    if (!f) return;
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = f.querySelector('input[type="email"]');
      const btn   = f.querySelector('button');
      if (!input || !input.value) return;
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i>';
      btn.disabled = true;
      input.value = '';
      setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; }, 3000);
    });
  };

  handleNewsletterForm('newsletterForm');
  handleNewsletterForm('footerNewsletterForm');

  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add('was-validated');
      return;
    }

    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending…';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check me-2"></i>Message Sent!';
      btn.classList.remove('btn-primary-custom');
      btn.classList.add('btn', 'btn-success');
      form.reset();
      form.classList.remove('was-validated');

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.classList.add('btn-primary-custom');
        btn.classList.remove('btn-success');
      }, 3000);
    }, 1500);
  });

}

/* ============================================================
   AOS (Animate On Scroll) INIT
   ============================================================ */

function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
    });
  }
}

/* ============================================================
   BOOTSTRAP TOOLTIPS
   ============================================================ */

function initTooltips() {
  if (typeof bootstrap !== 'undefined') {
    const tooltipEls = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipEls.forEach(el => new bootstrap.Tooltip(el));
  }
}

/* ============================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   MOBILE MENU AUTO-CLOSE
   ============================================================ */

function initMobileMenu() {
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const toggler  = document.querySelector('.navbar-toggler');
  const collapse = document.getElementById('navbarNav');

  if (!collapse) return;

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992) {
        const bsCollapse = bootstrap.Collapse.getInstance(collapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
}

/* ============================================================
   NAVBAR INCLUDE HELPER (shared HTML injection)
   ============================================================ */

/**
 * Navbar HTML string - injected into #navbar-placeholder if present
 * Allows one source of truth for the navbar across all pages.
 */
const NAVBAR_HTML = `
<nav class="navbar navbar-expand-lg fixed-top" id="mainNavbar" aria-label="Main navigation">
  <div class="container">
    <a class="navbar-brand" href="index.html" aria-label="BulkSend Home">
      <img src="assets/images/logo.png" alt="BulkSend – WhatsApp Messaging Software by JAAN Network" class="navbar-logo" width="160" height="60" loading="eager" />
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarNav" aria-controls="navbarNav"
            aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav mx-auto">
        <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="about.html">About</a></li>
        <li class="nav-item"><a class="nav-link" href="services.html">Services</a></li>
        <li class="nav-item"><a class="nav-link" href="pricing.html">Pricing</a></li>
        <li class="nav-item"><a class="nav-link" href="feedback.html">Feedback</a></li>
        <li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>
      </ul>
      <div class="navbar-actions">
        <button class="theme-toggle" id="themeToggle" aria-label="Toggle colour theme">
          <i class="fas fa-sun"></i>
        </button>
        <a href="https://wa.me/94765933255?text=Hi!%20I%20want%20to%20purchase%20BulkSend%20v1.1" class="btn btn-nav-cta" target="_blank" rel="noopener noreferrer" aria-label="Buy BulkSend on WhatsApp">
          <i class="fab fa-whatsapp me-1"></i>Buy Now
        </a>
      </div>
    </div>
  </div>
</nav>`;

const FOOTER_HTML = `
<footer class="footer">
  <div class="container">
    <div class="row g-4">
      <!-- Brand Column -->
      <div class="col-lg-4 col-md-6">
        <div class="footer-brand">
          <div class="footer-logo-icon"><i class="fab fa-whatsapp"></i></div>
          <div class="footer-logo-text">Bulk<span>Send</span></div>
        </div>
        <p class="footer-tagline">Smart. Simple. Powerful.<br>The Ultimate WhatsApp Marketing Solution.</p>
        <div class="footer-social">
          <a href="#" class="social-link" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="social-link" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="#" class="social-link" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
          <a href="#" class="social-link" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
          <a href="https://wa.me/94765933255" class="social-link" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="col-lg-2 col-md-6 col-6">
        <h6>Quick Links</h6>
        <ul class="footer-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About Us</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="pricing.html">Pricing</a></li>
          <li><a href="feedback.html">Feedback</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>

      <!-- Services -->
      <div class="col-lg-3 col-md-6 col-6">
        <h6>Features</h6>
        <ul class="footer-links">
          <li><a href="services.html">Bulk Message Send</a></li>
          <li><a href="services.html">Contact Extraction</a></li>
          <li><a href="services.html">Group Messaging</a></li>
          <li><a href="services.html">Message Scheduling</a></li>
          <li><a href="services.html">Analytics Dashboard</a></li>
          <li><a href="services.html">API Integration</a></li>
        </ul>
      </div>

      <!-- Contact -->
      <div class="col-lg-3 col-md-6">
        <h6>Contact Us</h6>
        <div class="footer-contact-item">
          <i class="fas fa-map-marker-alt"></i>
          <span>No. 46, Hudson Road,<br>Colombo 3, Sri Lanka.</span>
        </div>
        <div class="footer-contact-item">
          <i class="fab fa-whatsapp"></i>
          <span><a href="https://wa.me/94765933255" style="color:inherit;">076 593 3255</a></span>
        </div>
        <div class="footer-contact-item">
          <i class="fas fa-envelope"></i>
          <span><a href="mailto:jaanclaude.lk@gmail.com" style="color:inherit;">jaanclaude.lk@gmail.com</a></span>
        </div>
        <div class="footer-contact-item">
          <i class="fab fa-windows"></i>
          <span>Available for Windows</span>
        </div>
      </div>
    </div>

    <!-- Footer Bottom -->
    <div class="footer-bottom">
      <p>&copy; ${new Date().getFullYear()} <strong style="color:var(--primary)">JAAN Network Pvt Ltd</strong>. All Rights Reserved.</p>
      <ul class="footer-bottom-links">
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Terms of Use</a></li>
        <li><a href="#">Refund Policy</a></li>
      </ul>
    </div>
  </div>
</footer>`;

/* Inject shared components if placeholders exist. Try to load header.html/footer.html first, fallback to internal HTML. */
async function injectComponents() {
  const navPlaceholder    = document.getElementById('navbar-placeholder');
  const footerPlaceholder = document.getElementById('footer-placeholder');

  const fetchOrFallback = async (url, fallback) => {
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (res.ok) return await res.text();
    } catch (e) {
      // ignore and fallback
    }
    return fallback;
  };

  if (navPlaceholder) {
    const html = await fetchOrFallback('header.html', NAVBAR_HTML);
    navPlaceholder.innerHTML = html;
  }

  if (footerPlaceholder) {
    const html = await fetchOrFallback('footer.html', FOOTER_HTML);
    footerPlaceholder.innerHTML = html;
  }

  if (navPlaceholder || footerPlaceholder) {
    initNavbar();
    initActiveNav();
    initThemeToggle();
    initMobileMenu();
    initTooltips();
    initFormValidation();
  }
}

// Run injection (don't block other inits)
injectComponents();
