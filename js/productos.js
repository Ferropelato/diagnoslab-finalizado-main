(function productosPage() {
  if (!document.title.toLowerCase().includes('productos')) return;

  const CATEGORY_IDS = ['sangre', 'orina', 'otros', 'aparatologia'];
  // Usar utilidades comunes

  const allCards = $$('.prod-card');
  const searchInput = $('#buscadorProductos');

  const quickBtns = $$('a.btn, a.btn-outline-primary, a.btn-primary')
    .filter(a => {
      const href = a.getAttribute('href') || '';
      return href.startsWith('#') && CATEGORY_IDS.includes(href.slice(1));
    });

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

  if (searchInput) {
    const handler = () => {
      currentQuery = searchInput.value || '';
      applyFilters();
    };
    searchInput.addEventListener('input', handler);
  }

  setActiveBtn(null);
  applyFilters();
  console.log('Productos.js: filtros activos ✔');
})();
