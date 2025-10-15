document.documentElement.classList.add('js');

function debounce(fn, wait = 300) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(null, args), wait);
    };
}

let newsletter = [];

function loadNewsletter() {
    newsletter = window.StorageUtils.get(window.SITE_CONFIG.storageKeys.news, []);
}

function saveNewsletter() {
    window.StorageUtils.set(window.SITE_CONFIG.storageKeys.news, newsletter);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function subscribeEmail(email) {
    if (!email || !isValidEmail(email)) {
        window.UIUtils.showToast('Ingresá un email válido (ej: usuario@dominio.com).', 'warning');
        return;
    }
    const exists = newsletter.includes(email.toLowerCase());
    if (exists) {
        window.UIUtils.showToast('Este email ya está suscripto.', 'info');
        return;
    }
    newsletter.push(email.toLowerCase());
    saveNewsletter();
    window.UIUtils.showToast('📧 ¡Gracias por suscribirte! Revisá tu correo.', 'success');
}

function setupNavbarShadow() {
    const nav = $('.navbar');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

function setupThemeToggle() {
    const btn = $('#themeToggle');
    if (!btn) return;
    if (!localStorage.getItem('theme')) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
    }
    applyTheme(localStorage.getItem('theme'));

    btn.addEventListener('click', () => {
        const next = (localStorage.getItem('theme') === 'dark') ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        applyTheme(next);
    });
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
}

function setupProductsSearch() {
    const input = $('#buscadorProductos');
    if (!input) return;
    const cards = $$('.prod-card');

    const filter = () => {
        window.SearchUtils.filterCards(cards, input.value);
        const live = document.getElementById('aria-live-region');
        if (live) {
            const visibles = [...cards].filter(c => c.style.display !== 'none').length;
            live.textContent = `${visibles} productos visibles`;
        }
    };

    input.addEventListener('input', debounce(filter, 300)); // ← usa el local
}

function setupNewsletterForm() {
    const form = document.querySelector('.home-news__form');
    if (!form) return;
    const input = form.querySelector('input[type="email"]');
    const feedback = form.querySelector('.invalid-feedback');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!input.checkValidity()) {
            form.classList.add('was-validated');
            feedback.textContent = 'Ingresá un email válido (ej: usuario@dominio.com).';
            input.focus();
            window.UIUtils.announce('Email inválido en newsletter');
            return;
        }
        subscribeEmail(input.value.trim());
        form.reset();
        form.classList.remove('was-validated');
        feedback.textContent = '';
        window.UIUtils.showToast('¡Te suscribiste a las novedades! 📬', 'success');
    });
}

function showWelcomeBanner() {
    const key = window.SITE_CONFIG.storageKeys.welcome;
    if (localStorage.getItem(key) === '1') return;

    const host = document.querySelector('main') || document.body;
    const banner = document.createElement('div');
    banner.className = 'dlb-welcome alert alert-info d-flex align-items-center justify-content-between';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Bienvenida');
    banner.innerHTML = `
    <div class="me-3">
      <strong>¡Bienvenido/a a ${window.SITE_CONFIG.name}!</strong>
      <span class="ms-2">Explorá productos y servicios. Si necesitás ayuda, abrí “Contacto”.</span>
    </div>
    <button type="button" class="btn btn-sm btn-outline-primary">Entendido</button>
  `;
    const btn = banner.querySelector('button');
    btn.addEventListener('click', () => {
        banner.remove();
        localStorage.setItem(key, '1');
        window.UIUtils.showToast('¡Que tengas una gran experiencia! ✨', 'success');
        const live = document.getElementById('aria-live-region');
        if (live) live.textContent = 'Bienvenida cerrada';
    });
    host.prepend(banner);
}

function startLiveClock() {
    const el = document.getElementById('liveClock');
    if (!el) return;
    const pad = (n) => String(n).padStart(2, '0');
    setInterval(() => {
        const d = new Date();
        el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }, 1000);
}
window.addEventListener('DOMContentLoaded', startLiveClock);

function startPromoCountdown(endISO) {
    const el = document.getElementById('promoCountdown');
    if (!el) return;
    const end = new Date(endISO);
    const tick = () => {
        const ms = end - new Date();
        if (ms <= 0) { el.textContent = 'Promoción finalizada'; clearInterval(tid); return; }
        const s = Math.floor(ms / 1000) % 60;
        const m = Math.floor(ms / 60000) % 60;
        const h = Math.floor(ms / 3600000);
        el.textContent = `Termina en ${h}h ${m}m ${s}s`;
    };
    const tid = setInterval(tick, 1000);
    tick();
}
window.addEventListener('DOMContentLoaded', () => {
    const key = 'dlab_promo_end';
    let end = localStorage.getItem(key);
    if (!end) { const d = new Date(); d.setDate(d.getDate() + 10); end = d.toISOString(); localStorage.setItem(key, end); }
    startPromoCountdown(end);
});

window.addEventListener('error', (e) => { window.Swal && Swal.fire({ icon: 'error', title: 'Error', text: e.message }); });
window.addEventListener('unhandledrejection', (e) => { window.Swal && Swal.fire({ icon: 'error', title: 'Error asíncrono', text: e.reason?.message || String(e.reason) }); });

document.addEventListener('DOMContentLoaded', () => {
    loadNewsletter();

    setupNavbarShadow();
    setupThemeToggle();

    setupProductsSearch();
    setupNewsletterForm();

    showWelcomeBanner();

    console.log(`${window.SITE_CONFIG.name} v${window.SITE_CONFIG.version} — main.js listo ✔`);
});