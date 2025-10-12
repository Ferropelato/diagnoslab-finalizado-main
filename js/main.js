window.toast = window.toast || function (text, type = 'info') {
    try {
        if (window.Toastify) {
            Toastify({ text, duration: 3000, close: true, gravity: 'top', position: 'right' }).showToast();
        } else {
            console.log('Toast:', text);
        }
    } catch (_) { console.log('Toast:', text); }
};

window.$swal = window.$swal || function (opts) {
    if (window.Swal && Swal.fire) return Swal.fire(opts);
    alert(opts?.title ? `${opts.title}\n${opts.text || ''}` : (opts?.text || String(opts)));
    return Promise.resolve();
};

window.confirmAsync = window.confirmAsync || async function (text) {
    if (window.Swal && Swal.fire) {
        const r = await Swal.fire({ text, icon: 'question', showCancelButton: true, confirmButtonText: 'Sí', cancelButtonText: 'No' });
        return r.isConfirmed;
    }
    return confirm(text);
};

window.ARS = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

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

const SITE_NAME = 'DiagnosLab';
const VERSION = '1.0.0';
const LSK_CART = 'dlab_cart';
const LSK_NEWS = 'dlab_news_emails';
const LSK_WELCOME = 'dlab_welcome_shown';

let cart = [];
let newsletter = [];

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

function loadCart() {
    try {
        cart = JSON.parse(localStorage.getItem(LSK_CART) || '[]');
        if (!Array.isArray(cart)) cart = [];
    } catch { cart = []; }

    window.cart = cart;
}

function saveCart() {
    try {
        localStorage.setItem(LSK_CART, JSON.stringify(cart));
    } catch (e) {
        console.error('No se pudo guardar el carrito:', e);
        window.toast('No se pudo guardar el carrito (almacenamiento)', 'warning');
    }
}

function loadNewsletter() {
    try {
        newsletter = JSON.parse(localStorage.getItem(LSK_NEWS) || '[]');
        if (!Array.isArray(newsletter)) newsletter = [];
    } catch { newsletter = []; }
}

function saveNewsletter() {
    localStorage.setItem(LSK_NEWS, JSON.stringify(newsletter));
}

function normalizeId(text) {
    return (text || 'producto')
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
}

function parsePriceFromCard(card) {
    if (!card) return 0;
    const raw = card.getAttribute('data-price') || '';
    const cleaned = raw.replace(/[^\d]/g, '');
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
}

function parseProductCard(card) {
    const explicitId = card.getAttribute('data-id');
    const titleEl = card.querySelector('h3');
    const title = titleEl ? titleEl.textContent.trim() : 'Producto';
    const id = explicitId || normalizeId(title);
    const imgEl = card.querySelector('img');
    const img = imgEl ? imgEl.getAttribute('src') : '';
    const price = parsePriceFromCard(card);
    return { id, title, img, price };
}

function cartTotals() {
    const totalItems = cart.reduce((acc, p) => acc + (p.qty || 0), 0);
    const amount = cart.reduce((acc, p) => acc + (p.price || 0) * (p.qty || 0), 0);
    return { totalItems, amount };
}

function renderCartBadge() {
    const badge = document.getElementById('cartCount');
    if (!badge) return;
    const { totalItems } = cartTotals();
    if (totalItems > 0) {
        badge.textContent = totalItems > 99 ? '99+' : String(totalItems);
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}
window.renderCartBadge = renderCartBadge;

function addToCart(item, qty = 1) {
    try {
        const addQty = Math.max(1, parseInt(qty, 10) || 1);
        if (!item || !item.id) throw new Error('Producto sin ID válido');

        const i = cart.findIndex(p => p.id === item.id);
        if (i >= 0) {
            cart[i].qty = (cart[i].qty || 0) + addQty;
        } else {
            cart.push({ ...item, qty: addQty });
        }

        saveCart();
        renderCartBadge();
        window.renderCartUI && window.renderCartUI();
        window.toast('Producto agregado al carrito ✅', 'success');
        return true;
    } catch (e) {
        console.error('addToCart error:', e);
        window.$swal({ icon: 'error', title: 'No se pudo agregar', text: e.message || 'Error inesperado' });
        return false;
    }
}
window.addToCart = addToCart;

function removeFromCart(id) {
    const i = cart.findIndex(p => p.id === id);
    if (i >= 0) {
        cart.splice(i, 1);
        saveCart();
        renderCartBadge();
        window.renderCartUI && window.renderCartUI();
        window.toast('Producto eliminado 🗑️');
    }
}
window.removeFromCart = removeFromCart;

window.clearCart = async function () {
    if (!cart.length) return window.toast('El carrito ya está vacío', 'info');
    const ok = await window.confirmAsync('¿Vaciar carrito por completo?');
    if (!ok) return;
    cart.splice(0, cart.length);
    saveCart();
    renderCartBadge();
    window.renderCartUI && window.renderCartUI();
    window.toast('Carrito vaciado 🧹', 'info');
};

function subscribeEmail(email) {
    if (!email) return window.toast('Ingresá un email válido.', 'warning');
    const exists = newsletter.includes(email.toLowerCase());
    if (exists) return window.toast('Este email ya está suscripto.', 'info');
    newsletter.push(email.toLowerCase());
    saveNewsletter();
    window.toast('📧 ¡Gracias por suscribirte! Revisá tu correo.', 'success');
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

function bindAddButtons() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-add');
        if (!btn) return;
        const card = btn.closest('.prod-card');
        if (!card) return;

        const item = parseProductCard(card);
        const qtyInput = card.querySelector('.qty-input');
        const qty = Math.max(1, parseInt(qtyInput?.value, 10) || 1);

        addToCart(item, qty);
    }, { passive: false });
}

function setupProductsSearch() {
    const input = $('#buscadorProductos');
    if (!input) return;
    const cards = $$('.prod-card');
    const filter = () => {
        const q = input.value.toLowerCase().trim();
        cards.forEach(card => {
            const tags = (card.getAttribute('data-tags') || '').toLowerCase();
            const title = $('h3', card)?.textContent?.toLowerCase() || '';
            card.style.display = (!q || tags.includes(q) || title.includes(q)) ? '' : 'none';
        });
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
    if (localStorage.getItem(LSK_WELCOME) === '1') return;
    const nombre = prompt(`¡Bienvenido/a a ${SITE_NAME}! ¿Cómo te llamás? (opcional)`);
    if (nombre && nombre.trim().length > 0) {
        alert(`Hola, ${nombre.trim()} 👋\nSi necesitás ayuda, escribime desde "Contacto".`);
    } else {
        alert(`¡Bienvenido/a! Podés explorar productos y servicios.\nAbrí "Productos" y probá agregar items al carrito.`);
    }
    localStorage.setItem(LSK_WELCOME, '1');
}

function setupInViewAnimations() {
    const targets = $$('.prod-card, .serv-card, .home-ben, .home-cat');
    if (!targets.length) return;
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(ent => {
            if (ent.isIntersecting) {
                ent.target.classList.add('in-view');
                obs.unobserve(ent.target);
            }
        });
    }, { threshold: 0.15 });
    targets.forEach(t => io.observe(t));
}

function setupCartLink() {
    const link = $('#cartLink');
    if (!link) return;
    link.addEventListener('click', (e) => {
        if (e.shiftKey) {
            e.preventDefault();
            window.clearCart();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    loadNewsletter();

    setupNavbarShadow();
    setupThemeToggle();
    setupInViewAnimations();

    bindAddButtons();
    setupProductsSearch();
    setupNewsletterForm();
    setupCartLink();

    renderCartBadge();

    maybeWelcome();

    console.log(`${SITE_NAME} v${VERSION} — main.js listo ✔`);
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

setTimeout(() => { try { window.toast('¡Bienvenido a DiagnosLab 👋!'); } catch { } }, 1500);
