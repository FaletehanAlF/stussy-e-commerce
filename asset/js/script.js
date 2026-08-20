/* ==========================================================
   STUSSY LANDING — script.js
   Pure B&W, zero-fetch, capsule navbar, smooth & elegant
   ========================================================== */

(function () {
  'use strict';

  /* ==================== DATA ==================== */
  var PRODUCTS = [
    { id: 'p01', name: '8-Ball Tee',     cat: 'tees',      price: 449000,  badge: 'NEW',          desc: 'Katun 240gsm, sablon puff signature bola 8.' },
    { id: 'p02', name: 'Stock Hoodie',   cat: 'hoodies',   price: 899000,  badge: 'BEST SELLER',  desc: 'Fleece 380gsm brushed, box logo bordir dada.' },
    { id: 'p03', name: 'World Tour Cap', cat: 'headwear',  price: 359000,  badge: '',             desc: '6-panel twill, strapback logam anti karat.' },
    { id: 'p04', name: 'Script Tee',     cat: 'tees',      price: 399000,  badge: '',             desc: 'Signature script di dada, potongan boxy fit.' },
    { id: 'p05', name: 'Work Jacket',    cat: 'outerwear', price: 1249000, badge: 'LIMITED',      desc: 'Canvas 12oz, lapisan flannel, kancing logam.' },
    { id: 'p06', name: 'Half Zip Mock',  cat: 'hoodies',   price: 799000,  badge: '',             desc: 'Rib collar, zipper YKK, cocok layering.' },
    { id: 'p07', name: 'Chain Stitch Beanie', cat: 'headwear', price: 259000, badge: 'NEW',      desc: 'Rajut akrilik tebal, label chain-stitch.' },
    { id: 'p08', name: 'Tool Bag Crossbody', cat: 'accessories', price: 549000, badge: '',       desc: 'Cordura 1000D, strap adjustable, water resist.' }
  ];

  /* ==================== INIT ==================== */
  document.addEventListener('DOMContentLoaded', function () {
    renderProducts(PRODUCTS);
    initNavbar();
    initMobileMenu();
    initActiveLink();
    initCategoryFilter();
    initContactForm();
    initNewsletter();
    initScrollReveal();
    initHeroParallax();
    initScrollProgress();
    initSmoothCounters();
    initSmoothAnchorLinks();

    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });

  /* ==================== PRODUCTS ==================== */
  function formatPrice(n) {
    return 'Rp' + Number(n).toLocaleString('id-ID');
  }

  function renderProducts(list) {
    var grid = document.getElementById('productGrid');
    if (!grid) return;

    if (!list || !list.length) {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#777;padding:48px 0;font-family:var(--font-mono);font-size:13px;">Tidak ada produk.</p>';
      return;
    }

    grid.innerHTML = '';

    list.forEach(function (p, i) {
      var card = document.createElement('article');
      card.className = 'product-card';
      card.setAttribute('data-id', p.id);
      card.setAttribute('data-cat', p.cat);
      card.style.opacity = '0';
      card.style.transform = 'translateY(32px)';

      var badgeHTML = p.badge
        ? '<span class="product-badge">' + p.badge + '</span>'
        : '';

      card.innerHTML =
        '<div class="product-thumb">' +
          badgeHTML +
          '<div class="product-thumb-inner">' +
            '<div class="product-thumb-letter">' + p.name.charAt(0) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="product-info">' +
          '<div class="product-info-top">' +
            '<span class="product-cat">' + p.cat + '</span>' +
            '<button class="add-btn" aria-label="Tambah ' + p.name + '" data-add="' + p.id + '">' +
              '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>' +
            '</button>' +
          '</div>' +
          '<h3 class="product-name">' + p.name + '</h3>' +
          '<p class="product-desc">' + p.desc + '</p>' +
          '<div class="product-price">' +
            '<span class="price">' + formatPrice(p.price) + '</span>' +
            '<span class="product-status">' + (p.badge || 'Tersedia') + '</span>' +
          '</div>' +
        '</div>';

      grid.appendChild(card);

      setTimeout(function () {
        card.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100 + i * 100);
    });

    bindAddToCart();
    bind3DTilt();
  }

  /* ==================== CATEGORY FILTER ==================== */
  function initCategoryFilter() {
    var buttons = document.querySelectorAll('.cat-card');
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        var filtered = (filter === 'all')
          ? PRODUCTS
          : PRODUCTS.filter(function (p) { return p.cat === filter; });
        renderProducts(filtered);
        var section = document.getElementById('produk');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ==================== 3D TILT ==================== */
  function bind3DTilt() {
    var cards = document.querySelectorAll('.product-card');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(600px) rotateY(' + (x * 8) + 'deg) rotateX(' + (y * -8) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'translateY(0)';
        card.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
      });
    });
  }

  /* ==================== ADD TO CART ==================== */
  function bindAddToCart() {
    var buttons = document.querySelectorAll('[data-add]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        btn.style.transform = 'scale(1.4)';
        setTimeout(function () { btn.style.transform = ''; }, 250);
        showToast('Ditambahkan ke keranjang');
      });
    });
  }

  /* ==================== NAVBAR ==================== */
  function initNavbar() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;
    var lastScroll = 0;

    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;

      // Shrink navbar after 40px scroll
      navbar.classList.toggle('shrink', scrollY > 40);

      // Hide navbar on scroll down, show on scroll up (only after 200px)
      if (scrollY > 200) {
        if (scrollY > lastScroll + 5) {
          navbar.style.transform = 'translateY(-100%)';
        } else if (scrollY < lastScroll - 5) {
          navbar.style.transform = 'translateY(0)';
        }
      } else {
        navbar.style.transform = 'translateY(0)';
      }
      lastScroll = scrollY;
    }, { passive: true });
  }

  /* ==================== MOBILE MENU ==================== */
  function initMobileMenu() {
    var btn = document.getElementById('hamburger');
    var menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;

    function closeMenu() {
      btn.classList.remove('open');
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }

    btn.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('open');
      btn.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
    });

    menu.querySelectorAll('.mobile-link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        closeMenu();
      }
    });
  }

  /* ==================== ACTIVE NAV LINK ==================== */
  function initActiveLink() {
    var sections = document.querySelectorAll('main section[id], .hero[id]');
    var navLinks = document.querySelectorAll('.nav-links .nav-link');
    if (!sections.length || !navLinks.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ==================== SCROLL REVEAL ==================== */
  function initScrollReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { observer.observe(el); });
  }

  /* ==================== HERO PARALLAX ==================== */
  function initHeroParallax() {
    var hero = document.querySelector('.hero');
    var heroTitle = document.querySelector('.hero-title');
    var heroContent = document.querySelector('.hero-content');
    if (!hero || !heroTitle) return;

    hero.setAttribute('data-parallax', '');

    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      var heroH = hero.offsetHeight;
      if (scrollY > heroH) return;

      var ratio = scrollY / heroH;

      // Title parallax - moves slower than scroll
      heroTitle.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
      heroTitle.style.opacity = 1 - ratio * 0.6;

      // Content subtle fade
      if (heroContent) {
        heroContent.style.transform = 'translateY(' + (scrollY * 0.08) + 'px)';
        heroContent.style.opacity = 1 - ratio * 0.4;
      }
    }, { passive: true });
  }

  /* ==================== SCROLL PROGRESS ==================== */
  function initScrollProgress() {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? scrollTop / docHeight : 0;
      bar.style.transform = 'scaleX(' + progress + ')';
    }, { passive: true });
  }

  /* ==================== ANIMATED COUNTERS ==================== */
  function initSmoothCounters() {
    var stats = document.querySelectorAll('.about-stat-num');
    if (!stats.length) return;

    var animated = false;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !animated) {
          animated = true;
          stats.forEach(function (el) {
            var text = el.textContent.trim();
            // Only animate numeric values
            var num = parseInt(text, 10);
            if (isNaN(num) || num === 0) return;

            var suffix = text.replace(String(num), '');
            var duration = 1500;
            var start = performance.now();

            function tick(now) {
              var elapsed = now - start;
              var progress = Math.min(elapsed / duration, 1);
              // Ease out cubic
              var eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = Math.round(num * eased) + suffix;
              if (progress < 1) requestAnimationFrame(tick);
            }

            el.textContent = '0' + suffix;
            requestAnimationFrame(tick);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    var statsSection = document.querySelector('.about-stats');
    if (statsSection) observer.observe(statsSection);
  }

  /* ==================== SMOOTH ANCHOR LINKS ==================== */
  function initSmoothAnchorLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var offset = 80; // navbar height offset
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ==================== CONTACT FORM ==================== */
  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;
    var success = document.getElementById('formSuccess');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (success) success.classList.remove('show');

      var valid = true;
      valid = validateField('username', function (v) { return v.trim().length >= 3; }, 'Username minimal 3 karakter') && valid;
      valid = validateField('email', function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, 'Format email tidak valid') && valid;
      valid = validateField('message', function (v) { return v.trim().length >= 10; }, 'Pesan minimal 10 karakter') && valid;

      if (!valid) return;

      if (success) success.classList.add('show');
      showToast('Pesan berhasil dikirim');
      form.reset();
      setTimeout(function () { if (success) success.classList.remove('show'); }, 4000);
    });

    ['username', 'email', 'message'].forEach(function (id) {
      var input = document.getElementById(id);
      if (input) input.addEventListener('input', function () { clearFieldError(id); });
    });
  }

  function validateField(id, testFn, message) {
    var input = document.getElementById(id);
    var errorEl = document.getElementById('err-' + id);
    if (!input || !errorEl) return true;
    var field = input.closest('.field');
    var value = input.value || '';

    if (!testFn(value)) {
      errorEl.textContent = message;
      if (field) field.classList.add('invalid');
      return false;
    }
    clearFieldError(id);
    return true;
  }

  function clearFieldError(id) {
    var input = document.getElementById(id);
    var errorEl = document.getElementById('err-' + id);
    if (!input || !errorEl) return;
    var field = input.closest('.field');
    errorEl.textContent = '';
    if (field) field.classList.remove('invalid');
  }

  /* ==================== NEWSLETTER ==================== */
  function initNewsletter() {
    var form = document.getElementById('newsletterForm');
    var msg = document.getElementById('newsletterMsg');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      if (!input.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        if (msg) { msg.style.color = '#fff'; msg.textContent = 'Masukkan email yang valid.'; }
        return;
      }
      if (msg) { msg.style.color = '#fff'; msg.textContent = 'Terima kasih! Kamu sudah terdaftar.'; }
      form.reset();
    });
  }

  /* ==================== TOAST ==================== */
  var toastTimer = null;
  function showToast(message) {
    var toast = document.getElementById('toast');
    var msgEl = document.getElementById('toastMsg');
    if (!toast || !msgEl) return;

    msgEl.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2800);
  }

})();
