// Gestor de carrito centralizado para DiagnosLab
// Maneja toda la lógica del carrito de compras

class CartManager {
  constructor() {
    this.cart = [];
    this.loadCart();
    this.setupEventListeners();
  }

  loadCart() {
    this.cart = window.StorageUtils.get(window.SITE_CONFIG.storageKeys.cart, []);
    if (!Array.isArray(this.cart)) this.cart = [];
    window.cart = this.cart;
  }

  saveCart() {
    const success = window.StorageUtils.set(window.SITE_CONFIG.storageKeys.cart, this.cart);
    if (!success) {
      window.UIUtils.showToast('No se pudo guardar el carrito', 'warning');
    }
  }

  getTotals() {
    const totalItems = this.cart.reduce((acc, item) => acc + (item.qty || 0), 0);
    const totalAmount = this.cart.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 0), 0);
    return { totalItems, totalAmount };
  }

  addItem(item, qty = 1) {
    try {
      const addQty = Math.max(1, parseInt(qty, 10) || 1);
      if (!item || !item.id) throw new Error('Producto sin ID válido');

      // Límite máximo por producto
      const MAX_QTY_PER_ITEM = 10;
      const existingIndex = this.cart.findIndex(p => p.id === item.id);
      if (existingIndex >= 0) {
        const newQty = (this.cart[existingIndex].qty || 0) + addQty;
        if (newQty > MAX_QTY_PER_ITEM) {
          window.UIUtils.showToast(`Límite máximo: ${MAX_QTY_PER_ITEM} unidades por producto`, 'warning');
          this.cart[existingIndex].qty = MAX_QTY_PER_ITEM;
        } else {
          this.cart[existingIndex].qty = newQty;
        }
      } else {
        this.cart.push({ ...item, qty: Math.min(addQty, MAX_QTY_PER_ITEM) });
      }

      this.saveCart();
      this.updateUI();
      window.UIUtils.showToast('Producto agregado al carrito ✅', 'success');
      window.UIUtils.announce(`Producto agregado. Total: ${this.getTotals().totalItems} productos`);
      return true;
    } catch (e) {
      console.error('Error agregando al carrito:', e);
      window.UIUtils.showAlert({
        icon: 'error',
        title: 'No se pudo agregar',
        text: e.message || 'Error inesperado'
      });
      return false;
    }
  }

  removeItem(id) {
    const index = this.cart.findIndex(p => p.id === id);
    if (index >= 0) {
      this.cart.splice(index, 1);
      this.saveCart();
      this.updateUI();
      window.UIUtils.showToast('Producto eliminado 🗑️');
      window.UIUtils.announce(`Producto eliminado. Total: ${this.getTotals().totalItems} productos`);
    }
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
    this.updateUI();
    window.UIUtils.showToast('Carrito vaciado 🧹', 'info');
    window.UIUtils.announce('El carrito se vació completamente');
  }

  async clearCartWithConfirmation() {
    if (!this.cart.length) {
      window.UIUtils.showToast('El carrito ya está vacío', 'info');
      return;
    }

    const confirmed = await window.UIUtils.confirm('¿Vaciar carrito por completo?');
    if (confirmed) {
      this.clearCart();
    }
  }

  updateUI() {
    this.updateBadge();
    if (typeof window.renderCartUI === 'function') {
      window.renderCartUI();
    }
  }

  updateBadge() {
    const badge = $('#cartCount');
    if (!badge) return;

    const { totalItems } = this.getTotals();
    if (totalItems > 0) {
      badge.textContent = totalItems > 99 ? '99+' : String(totalItems);
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  }

  setupEventListeners() {
    // Botones de agregar al carrito (respeta min/step/max del input y avisa si ajusta)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-add');
      if (!btn) return;

      const card = btn.closest('.prod-card');
      if (!card) return;

      const item = this.parseProductCard(card);
      const qtyInput = card.querySelector('.qty-input');

      // Leer cantidad del input (o 1 si no hay)
      let qty = Math.max(1, parseInt(qtyInput?.value, 10) || 1);

      // Tomar atributos del input con valores por defecto
      const min  = Math.max(1, parseInt(qtyInput?.getAttribute('min')  || '1',   10));
      const step = Math.max(1, parseInt(qtyInput?.getAttribute('step') || '1',   10));
      const max  = Math.max(min, parseInt(qtyInput?.getAttribute('max')  || '999', 10));

      const original = qty;

      // Ajuste a múltiplo de step ≥ min
      if (step > 1) {
        const base = Math.max(min, qty);
        qty = Math.ceil(base / step) * step;
      }

      // Limitar a [min, max]
      qty = Math.min(Math.max(qty, min), max);

      // Si cambió, reflejar en UI y avisar
      if (qty !== original) {
        if (qtyInput) qtyInput.value = qty;
        window.UIUtils.showToast(`Cantidad ajustada a ${qty} (mín. ${min}, máx. ${max}, paso ${step})`, 'warning');
        window.UIUtils.announce?.(`Cantidad ajustada a ${qty}`);
      }

      this.addItem(item, qty);
    }, { passive: false });

    // Botones de eliminar del carrito
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-remove]');
      if (!btn) return;

      const id = btn.getAttribute('data-remove');
      this.removeItem(id);
    });

    // Botón de vaciar carrito
    const clearBtn = $('#btnClearCart');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.clearCartWithConfirmation();
      });
    }

    // Botón de checkout
    const checkoutBtn = $('#btnCheckout');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        this.handleCheckout();
      });
    }

    // Link del carrito (Shift+click para vaciar)
    const cartLink = $('#cartLink');
    if (cartLink) {
      cartLink.addEventListener('click', (e) => {
        if (e.shiftKey) {
          e.preventDefault();
          this.clearCartWithConfirmation();
        }
      });
    }
  }

  parseProductCard(card) {
    const explicitId = card.getAttribute('data-id');
    const titleEl = card.querySelector('h3');
    const title = titleEl ? titleEl.textContent.trim() : 'Producto';
    const id = explicitId || this.normalizeId(title);
    const imgEl = card.querySelector('img');
    const img = imgEl ? imgEl.getAttribute('src') : '';
    const price = this.parsePriceFromCard(card);
    return { id, title, img, price };
  }

  normalizeId(text) {
    return (text || 'producto')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  }

  parsePriceFromCard(card) {
    if (!card) return 0;
    const raw = card.getAttribute('data-price') || '';
    const cleaned = raw.replace(/[^\d]/g, '');
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }

  async handleCheckout() {
    if (!this.cart.length) {
      window.UIUtils.showToast('El carrito está vacío', 'warning');
      return;
    }

    // Verificar si el usuario está logueado
    if (!window.authManager || !window.authManager.isLoggedIn()) {
      window.UIUtils.showToast('Debes iniciar sesión para realizar un pedido', 'warning');
      // Detectar si estamos en una subcarpeta
      const isInSubfolder = window.location.pathname.includes('/pages/');
      window.location.href = isInSubfolder ? 'login.html' : 'pages/login.html';
      return;
    }

    const confirmed = await window.UIUtils.confirm('¿Deseás finalizar la compra? Se creará un pedido en tu cuenta.');
    if (confirmed) {
      // Crear pedido usando el OrderManager si está disponible
      if (window.orderManager) {
        const order = window.orderManager.createOrder([...this.cart]);
        window.UIUtils.showToast(`✅ ¡Pedido #${order.id} creado exitosamente!`, 'success');
      } else {
        // Fallback: guardar en localStorage
        const user = window.authManager.getCurrentUser();
        const orders = window.StorageUtils.get(`dlab_orders_${user.email}`, []);
        const order = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          status: 'pendiente',
          items: [...this.cart],
          total: this.getTotals().totalAmount,
          shippingAddress: user.direccion || 'Dirección no especificada',
          notes: 'Pedido creado desde el carrito'
        };
        orders.unshift(order);
        window.StorageUtils.set(`dlab_orders_${user.email}`, orders);
        window.UIUtils.showToast(`✅ ¡Pedido #${order.id} creado exitosamente!`, 'success');
      }

      this.clearCart();
    }
  }

  // Método para renderizar la UI del carrito (usado por cart.js)
  renderCartUI() {
    const listEl = $('#cartItems');
    const totalItemsEl = $('#cartTotalItems');
    const totalAmountEl = $('#cartTotalAmount');

    if (!listEl || !totalItemsEl) return;

    listEl.innerHTML = '';

    if (!this.cart.length) {
      listEl.innerHTML = `
        <li class="text-center text-muted py-4">
          <i class="bi bi-cart-x" style="font-size: 2rem; display: block; margin-bottom: 0.5rem;"></i>
          <div>Tu carrito está vacío</div>
          <small class="text-muted">Agregá productos para comenzar tu pedido</small>
        </li>
      `;
      totalItemsEl.textContent = '0';
      if (totalAmountEl) totalAmountEl.textContent = window.ARS.format(0);
      return;
    }

    const frag = document.createDocumentFragment();
    this.cart.forEach(item => {
      const li = document.createElement('li');
      li.className = 'd-flex align-items-center justify-content-between border-bottom py-2';
      li.innerHTML = `
        <div class="d-flex align-items-center gap-2">
          <img src="${item.img || '../acces/placeholder.png'}" alt="" style="width:48px;height:48px;object-fit:contain">
          <div>
            <div class="fw-semibold">${item.title || 'Producto'}</div>
            <small class="text-muted">${item.qty} × ${window.ARS.format(item.price || 0)}</small>
          </div>
        </div>
        <div class="d-flex align-items-center gap-2">
          <div class="text-end" style="min-width:90px">${window.ARS.format((item.price || 0) * (item.qty || 0))}</div>
          <button class="btn btn-sm btn-outline-danger" data-remove="${item.id}">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;
      frag.appendChild(li);
    });
    listEl.appendChild(frag);

    const { totalItems, totalAmount } = this.getTotals();
    totalItemsEl.textContent = String(totalItems);
    if (totalAmountEl) totalAmountEl.textContent = window.ARS.format(totalAmount);
  }
}

// Inicializar el gestor de carrito
window.cartManager = new CartManager();
window.renderCartUI = () => window.cartManager.renderCartUI();
window.addToCart = (item, qty) => window.cartManager.addItem(item, qty);
window.removeFromCart = (id) => window.cartManager.removeItem(id);
window.clearCart = () => window.cartManager.clearCartWithConfirmation();