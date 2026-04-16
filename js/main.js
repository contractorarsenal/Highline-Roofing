/* ============================================================
   HIGHLINE BUILDERS & ROOFING — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     NAV — Scroll behavior & hamburger
     ============================================================ */
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  const mobileClose = document.querySelector('.nav__mobile-close');

  if (nav) {
    const handleScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  if (mobileClose && mobileMenu) {
    mobileClose.addEventListener('click', () => {
      hamburger && hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  document.querySelectorAll('.nav__mobile .nav__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger && hamburger.classList.remove('open');
      mobileMenu && mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ============================================================
     ACTIVE NAV LINK
     ============================================================ */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html') ||
        (currentPage.toLowerCase() === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ============================================================
     SCROLL ANIMATIONS — Intersection Observer
     ============================================================ */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.fade-up, .fade-in, .slide-right, .slide-left')
    .forEach(el => observer.observe(el));

  /* ============================================================
     STAGGER CHILDREN
     ============================================================ */
  function stagger(containerSel, childSel, delay = 0.1) {
    document.querySelectorAll(containerSel).forEach(c => {
      c.querySelectorAll(childSel).forEach((el, i) => {
        el.classList.add('fade-up');
        el.style.transitionDelay = `${delay * i}s`;
        observer.observe(el);
      });
    });
  }

  stagger('.why__grid', '.why__card', 0.08);
  stagger('.services-grid', '.service-card', 0.08);
  stagger('.materials-grid', '.material-card', 0.12);
  stagger('.process__steps', '.process-step', 0.18);
  stagger('.reviews-slider', '.review-card', 0.1);
  stagger('.review-grid-full', '.review-card', 0.07);
  stagger('.values__grid', '.value-card', 0.08);

  /* ============================================================
     COUNTER ANIMATION
     ============================================================ */
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur = 1600;
      const start = performance.now();
      (function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(start);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

  /* ============================================================
     VIDEO — Auto play/pause on scroll
     ============================================================ */
  const videoObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause();
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('video[data-autoplay]').forEach(v => videoObs.observe(v));

  /* ============================================================
     BEFORE / AFTER SLIDER
     ============================================================ */
document.querySelectorAll('.ba-slider').forEach(slider => {
  const before = slider.querySelector('.ba-slider__before');
  const handle = slider.querySelector('.ba-slider__handle');

  if (!before || !handle) return;

  let dragging = false;

  const move = (x) => {
    const rect = slider.getBoundingClientRect();
    const percent = Math.max(2, Math.min(98, ((x - rect.left) / rect.width) * 100));
    before.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    handle.style.left = `${percent}%`;
  };

  /* Pointer Events — unified mouse + touch, drag anywhere on slider */
  slider.style.touchAction = 'none';
  slider.addEventListener('pointerdown', (e) => {
    dragging = true;
    slider.setPointerCapture(e.pointerId);
    move(e.clientX);
  });

  slider.addEventListener('pointermove', (e) => {
    if (dragging) move(e.clientX);
  });

  slider.addEventListener('pointerup', () => { dragging = false; });
  slider.addEventListener('pointercancel', () => { dragging = false; });
});
  /* ============================================================
     CONTACT FORM — Web3Forms AJAX (no redirect)
     ============================================================ */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const successBox = document.getElementById('formSuccess');
    const errorBox   = document.getElementById('formError');

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('.form-submit-btn');
      const originalHTML = btn.innerHTML;

      btn.innerHTML = '<span>Sending&hellip;</span>';
      btn.disabled = true;
      if (successBox) successBox.style.display = 'none';
      if (errorBox)   errorBox.style.display   = 'none';

      try {
        const res  = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body:   new FormData(contactForm),
        });
        const data = await res.json();

        if (data.success) {
          contactForm.reset();
          if (successBox) successBox.style.display = 'flex';
          btn.innerHTML = originalHTML;
          btn.disabled  = false;
          // Smooth scroll to message
          if (successBox) successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      } catch (err) {
        if (errorBox) errorBox.style.display = 'flex';
        btn.innerHTML = originalHTML;
        btn.disabled  = false;
      }
    });
  }

  /* ============================================================
     PARALLAX — hero bg drift
     ============================================================ */
  const heroBg = document.querySelector('.hero__video-bg');
  if (heroBg && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const s = window.scrollY;
          if (s < window.innerHeight * 1.5)
            heroBg.style.transform = `translateY(${s * 0.2}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ============================================================
     SMOOTH SCROLL
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const t = document.querySelector(link.getAttribute('href'));
      if (t) {
        e.preventDefault();
        window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    });
  });

  console.log('%c⬡ HIGHLINE BUILDERS & ROOFING', 'color:#FAA421;font-size:14px;font-weight:bold;');

})();
