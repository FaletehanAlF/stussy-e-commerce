/* ==========================================================
   STÜSSY LANDING — script.js
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initFeather();
  initNavbarScroll();
  initMobileMenu();
  initSmoothActiveLink();
  loadProducts();
  initCategoryFilter();
  initAuthModal();
  initContactForm();
  initNewsletterForm();
  initCartCounter();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------- Feather Icons ---------- */
function initFeather() {
  if (window.feather) {
    feather.replace({ 'stroke-width': 1.75 });
  } else {
    // fallback jika CDN belum siap
    window.addEventListener('load', () => window.feather && feather.replace({ 'stroke-width': 1.75 }));
  }
}
function refreshIcons() {
  if (window.feather) feather.replace({ 'stroke-width': 1.75 });
}

/* ---------- Navbar shrink on scroll ---------- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('shrink', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Mobile hamburger menu ---------- */
function initMobileMenu() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  const closeMenu = () => {
    btn.classList.remove('open');
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  };

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', closeMenu));

  const loginMobile = document.getElementById('loginBtnMobile');
  const registerMobile = document.getElementById('registerBtnMobile');
  if (loginMobile) loginMobile.addEventListener('click', () => { closeMenu(); openModal('login'); });
  if (registerMobile) registerMobile.addEventListener('click', () => { closeMenu(); openModal('register'); });
}

/* ---------- Active nav link on scroll ---------- */
function initSmoothActiveLink() {
  const sections = document.querySelectorAll('main section[id], .hero[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

/* ---------- Load produk dari products.json ---------- */
let ALL_PRODUCTS = [];

async function loadProducts() {
  const grid = document.getElementById('productGrid');
  const loading = document.getElementById('loadingState');
  if (!grid) return;

  try {
    const res = await fetch('api/produk.json');
    if (!res.ok) throw new Error('Gagal memuat produk');
    ALL_PRODUCTS = await res.json();
    renderProducts(ALL_PRODUCTS);
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<div class="loading-state"><i data-feather="alert-triangle"></i> Produk tidak dapat dimuat saat ini.</div>`;
    refreshIcons();
  } finally {
    if (loading && loading.parentElement === grid && grid.contains(loading)) {
      // sudah ditimpa oleh renderProducts / error state
    }
  }
}

function formatRupiah(num) {
  return 'Rp' + Number(num).toLocaleString('id-ID');
}

function renderProducts(products) {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  if (!products.length) {
    grid.innerHTML = `<div class="loading-state"><i data-feather="frown"></i> Tidak ada produk pada kategori ini.</div>`;
    refreshIcons();
    return;
  }

  grid.innerHTML = products.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="product-thumb">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <img src="https://placehold.co/500x625/${p.color}/fff?font=montserrat&text=${p.text}" alt="${p.name}" loading="lazy">
        <button class="product-quick" aria-label="Lihat cepat ${p.name}"><i data-feather="eye"></i></button>
      </div>
      <div class="product-info">
        <span class="product-cat">${p.category}</span>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-price">
          <span class="price">${formatRupiah(p.price)}</span>
          <button class="add-btn" aria-label="Tambah ${p.name} ke keranjang" data-add="${p.id}">
            <i data-feather="plus"></i>
          </button>
        </div>
      </div>
    </article>
  `).join('');

  refreshIcons();
  bindAddToCart();
  bind3DTilt();
}

/* ---------- Filter kategori ---------- */
function initCategoryFilter() {
  const buttons = document.querySelectorAll('.cat-card');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const filtered = filter === 'all' ? ALL_PRODUCTS : ALL_PRODUCTS.filter(p => p.category === filter);
      renderProducts(filtered);
      document.getElementById('produk').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ---------- Tilt 3D pada product card ---------- */
function bind3DTilt() {
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${y * -10}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---------- Cart counter (demo) ---------- */
function initCartCounter() {
  window.__cartTotal = 0;
}

function bindAddToCart() {
  document.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.__cartTotal = (window.__cartTotal || 0) + 1;
      const counter = document.getElementById('cartCount');
      if (counter) counter.textContent = window.__cartTotal;
      showToast('Produk ditambahkan ke keranjang');
    });
  });
}

/* ---------- Modal Login / Register ---------- */
function initAuthModal() {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  if (!overlay) return;

  if (loginBtn) loginBtn.addEventListener('click', () => openModal('login'));
  if (registerBtn) registerBtn.addEventListener('click', () => openModal('register'));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  if (tabLogin) tabLogin.addEventListener('click', () => switchTab('login'));
  if (tabRegister) tabRegister.addEventListener('click', () => switchTab('register'));

  if (loginForm) loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    closeModal();
    showToast('Login berhasil (demo)');
  });
  if (registerForm) registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    closeModal();
    showToast('Akun berhasil dibuat (demo)');
  });
}

function switchTab(tab) {
  document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
  document.getElementById('tabRegister').classList.toggle('active', tab === 'register');
  document.getElementById('loginForm').classList.toggle('active', tab === 'login');
  document.getElementById('registerForm').classList.toggle('active', tab === 'register');
}

function openModal(tab) {
  switchTab(tab);
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ---------- Contact form (username, email, message) ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const success = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    success.classList.remove('show');

    let valid = true;
    valid = validateField('username', v => v.trim().length >= 3, 'Username minimal 3 karakter') && valid;
    valid = validateField('email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Format email tidak valid') && valid;
    valid = validateField('message', v => v.trim().length >= 10, 'Pesan minimal 10 karakter') && valid;

    if (!valid) return;

    success.classList.add('show');
    refreshIcons();
    showToast('Pesan berhasil dikirim');
    form.reset();
    setTimeout(() => success.classList.remove('show'), 4000);
  });

  ['username', 'email', 'message'].forEach(id => {
    const input = document.getElementById(id);
    if (input) input.addEventListener('input', () => clearFieldError(id));
  });
}

function validateField(id, testFn, message) {
  const input = document.getElementById(id);
  const errorEl = document.getElementById(`err-${id}`);
  const field = input.closest('.field');
  const value = input.value || '';

  if (!testFn(value)) {
    errorEl.textContent = message;
    field.classList.add('invalid');
    return false;
  }
  clearFieldError(id);
  return true;
}

function clearFieldError(id) {
  const input = document.getElementById(id);
  const errorEl = document.getElementById(`err-${id}`);
  const field = input.closest('.field');
  errorEl.textContent = '';
  field.classList.remove('invalid');
}

/* ---------- Newsletter (footer) ---------- */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  const msg = document.getElementById('newsletterMsg');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      msg.style.color = '#fff';
      msg.textContent = 'Masukkan email yang valid.';
      return;
    }
    msg.style.color = '#fff';
    msg.textContent = 'Terima kasih! Kamu sudah terdaftar.';
    form.reset();
  });
}

/* ---------- Toast notification ---------- */
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toastMsg');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');
  refreshIcons();

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}