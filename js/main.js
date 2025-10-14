// Las utilidades ahora están en utils.js

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DiagnosLab: bienvenido');

    const nav = document.querySelector('.navbar');
    if (nav) {
        const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }
});

// Constantes y variables globales ahora están en utils.js y cart-manager.js
let newsletter = [];

// Funciones de carrito ahora están en cart-manager.js

function loadNewsletter() {
    newsletter = window.StorageUtils.get(window.SITE_CONFIG.storageKeys.news, []);
}

function saveNewsletter() {
    window.StorageUtils.set(window.SITE_CONFIG.storageKeys.news, newsletter);
}

// Funciones de carrito ahora están en cart-manager.js

function subscribeEmail(email) {
    if (!email) return window.UIUtils.showToast('Ingresá un email válido.', 'warning');
    const exists = newsletter.includes(email.toLowerCase());
    if (exists) return window.UIUtils.showToast('Este email ya está suscripto.', 'info');
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

// bindAddButtons ahora está en cart-manager.js

function setupProductsSearch() {
    const input = $('#buscadorProductos');
    if (!input) return;
    const cards = $$('.prod-card');
    const filter = () => {
        window.SearchUtils.filterCards(cards, input.value);
    };
    input.addEventListener('input', filter);
}

function setupNewsletterForm() {
    const form = $('.home-news__form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]')?.value.trim();
        subscribeEmail(email);
        form.reset();
    });
}

function maybeWelcome() {
    if (localStorage.getItem(window.SITE_CONFIG.storageKeys.welcome) === '1') return;
    const nombre = prompt(`¡Bienvenido/a a ${window.SITE_CONFIG.name}! ¿Cómo te llamás? (opcional)`);
    if (nombre && nombre.trim().length > 0) {
        alert(`Hola, ${nombre.trim()} 👋\nSi necesitás ayuda, escribime desde "Contacto".`);
    } else {
        alert(`¡Bienvenido/a! Podés explorar productos y servicios.\nAbrí "Productos" y probá agregar items al carrito.`);
    }
    localStorage.setItem(window.SITE_CONFIG.storageKeys.welcome, '1');
}

// setupInViewAnimations ahora está en utils.js

// setupCartLink ahora está en cart-manager.js

document.addEventListener('DOMContentLoaded', () => {
    loadNewsletter();

    setupNavbarShadow();
    setupThemeToggle();

    setupProductsSearch();
    setupNewsletterForm();

    maybeWelcome();

    console.log(`${window.SITE_CONFIG.name} v${window.SITE_CONFIG.version} — main.js listo ✔`);
});

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

setTimeout(() => { try { window.UIUtils.showToast('¡Bienvenido a DiagnosLab 👋!'); } catch { } }, 1500);
