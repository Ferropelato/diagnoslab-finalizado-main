(function cartOffcanvas() {

  function getCart() {
    return window.cartManager ? window.cartManager.cart : [];
  }
  function setCart(next) {
    if (window.cartManager) {
      window.cartManager.cart = Array.isArray(next) ? next : [];
      window.cartManager.saveCart();
    }
  }

  const listEl = $('#cartItems');
  const totalItemsEl = $('#cartTotalItems');
  const totalAmountEl = $('#cartTotalAmount');
  const clearBtn = $('#btnClearCart');
  const chkBtn = $('#btnCheckout');

  if (!listEl || !totalItemsEl) return;

  const fmtARS = window.ARS;

  function totals(c) {
    const items = c.reduce((a, p) => a + (p.qty || 0), 0);
    const amount = c.reduce((a, p) => a + ((p.price || 0) * (p.qty || 0)), 0);
    return { items, amount };
  }

  function renderCartUI() {
    const c = getCart();
    listEl.innerHTML = '';

    if (!c.length) {
      listEl.innerHTML = `<li class="text-muted">Tu carrito está vacío</li>`;
      totalItemsEl.textContent = '0';
      if (totalAmountEl) totalAmountEl.textContent = fmtARS.format(0);
      return;
    }

    const frag = document.createDocumentFragment();
    c.forEach(item => {
      const li = document.createElement('li');
      li.className = 'd-flex align-items-center justify-content-between border-bottom py-2';
      li.innerHTML = `
        <div class="d-flex align-items-center gap-2">
          <img src="${item.img || '../acces/placeholder.png'}" alt="" style="width:48px;height:48px;object-fit:contain">
          <div>
            <div class="fw-semibold">${item.title || 'Producto'}</div>
            <small class="text-muted">${item.qty} × ${fmtARS.format(item.price || 0)}</small>
          </div>
        </div>
        <div class="d-flex align-items-center gap-2">
          <div class="text-end" style="min-width:90px">${fmtARS.format((item.price || 0) * (item.qty || 0))}</div>
          <button class="btn btn-sm btn-outline-danger" data-remove="${item.id}">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;
      frag.appendChild(li);
    });
    listEl.appendChild(frag);

    const { items, amount } = totals(c);
    totalItemsEl.textContent = String(items);
    if (totalAmountEl) totalAmountEl.textContent = fmtARS.format(amount);
  }

  window.renderCartUI = renderCartUI;

  const off = document.getElementById('offcanvasCart');
  if (off) off.addEventListener('shown.bs.offcanvas', renderCartUI);

  window.addEventListener('storage', (e) => {
    if (e.key === window.SITE_CONFIG.storageKeys.cart) renderCartUI();
  });

  renderCartUI();
})();