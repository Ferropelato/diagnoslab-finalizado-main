(function productosPage() {
  // Solo corre en la página de productos
  if (!document.title.toLowerCase().includes('productos')) return;

  // --- Fallbacks seguros por si algo no cargó ---
  window.SearchUtils = window.SearchUtils || {};
  if (typeof window.SearchUtils.debounce !== 'function') {
    window.SearchUtils.debounce = function (fn, delay = 300) {
      let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(null, args), delay); };
    };
  }

  const CATEGORY_IDS = ['sangre', 'orina', 'otros', 'aparatologia'];

  const allCards = $$('.prod-card');
  const searchInput = $('#buscadorProductos');

  // Botones de salto rápido solo a IDs de categorías
  const quickBtns = $$('a.btn, a.btn-outline-primary, a.btn-primary')
    .filter(a => {
      const href = a.getAttribute('href') || '';
      return href.startsWith('#') && CATEGORY_IDS.includes(href.slice(1));
    });

  // Mapear cada tarjeta a su categoría (busca el H2 anterior más cercano con id válido)
  const cardCat = new Map();
  allCards.forEach(card => {
    let cat = 'otros';
    let walker = card;
    while (walker) {
      if (walker.tagName === 'H2' && CATEGORY_IDS.includes(walker.id)) {
        cat = walker.id;
        break;
      }
      walker = walker.previousElementSibling || walker.parentElement;
      if (walker && walker.classList?.contains('container')) break;
    }
    if (!CATEGORY_IDS.includes(cat)) {
      const nearestH2 = card.closest('.container')?.querySelector('h2[id]');
      if (nearestH2 && CATEGORY_IDS.includes(nearestH2.id)) cat = nearestH2.id;
    }
    cardCat.set(card, cat);
  });

  let currentCategory = null;
  let currentQuery = '';

  function setActiveBtn(cat) {
    quickBtns.forEach(b => {
      const isActive = b.getAttribute('href').slice(1) === cat;
      b.classList.toggle('active', isActive);
      b.classList.toggle('btn-primary', isActive);
      b.classList.toggle('btn-outline-primary', !isActive);
    });
  }

  function applyFilters() {
    const q = currentQuery.trim().toLowerCase();
    allCards.forEach(card => {
      const matchesCat = !currentCategory || cardCat.get(card) === currentCategory;
      const title = $('h3', card)?.textContent?.toLowerCase() || '';
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      const matchesText = q === '' || title.includes(q) || tags.includes(q);
      card.style.display = (matchesCat && matchesText) ? '' : 'none';
    });
  }

  // Click en filtros rápidos
  quickBtns.forEach(btn => {
    const cat = btn.getAttribute('href').slice(1);
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentCategory === cat) {
        currentCategory = null;
        setActiveBtn(null);
      } else {
        currentCategory = cat;
        setActiveBtn(cat);
      }
      if (searchInput) currentQuery = searchInput.value || '';
      applyFilters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Búsqueda con debounce (usa SearchUtils.debounce, con fallback definido arriba)
  if (searchInput) {
    const debounced = window.SearchUtils.debounce(() => {
      currentQuery = searchInput.value || '';
      applyFilters();

      // Accesibilidad: anunciar resultados
      const visible = [...allCards].filter(c => c.style.display !== 'none').length;
      window.UIUtils.announce?.(`${visible} productos visibles tras filtrar`);

      // Estado vacío visual
      let empty = document.getElementById('noResults');
      if (!empty) {
        empty = document.createElement('div');
        empty.id = 'noResults';
        empty.className = 'text-center text-muted my-4';
        empty.textContent = 'No hay resultados para tu búsqueda.';
        // Colocar el estado vacío cerca del buscador (misma .container)
        searchInput.closest('.container')?.appendChild(empty);
      }
      empty.style.display = visible === 0 ? '' : 'none';
    }, 300);

    searchInput.addEventListener('input', debounced);
  }

  setActiveBtn(null);
  applyFilters();
  // Filtros de productos activos
})();