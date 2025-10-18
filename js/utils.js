// Utilidades comunes para DiagnosLab
// Evita duplicación de código entre archivos

// Selectores DOM reutilizables
window.$ = (s, c = document) => c.querySelector(s);
window.$$ = (s, c = document) => [...c.querySelectorAll(s)];

// Formateo de moneda
window.ARS = new Intl.NumberFormat('es-AR', { 
  style: 'currency', 
  currency: 'ARS', 
  maximumFractionDigits: 0 
});

// Constantes globales
window.SITE_CONFIG = {
  name: 'DiagnosLab',
  version: '1.0.0',
  storageKeys: {
    cart: 'dlab_cart',
    news: 'dlab_news_emails',
    welcome: 'dlab_welcome_shown',
    messages: 'dlab_messages',
    users: 'dlab_users',
    newsSubs: 'dlab_news_subs'
  }
};

// Utilidades de almacenamiento
window.StorageUtils = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error guardando en localStorage:`, e);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
};

// Utilidades de validación
window.ValidationUtils = {
  email(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return re.test(email);
  },

  phone(phone) {
    const cleaned = phone.replace(/[^\d+\s()-]/g, '');
    return cleaned.length >= 8;
  },

  password(password) {
    return password && password.length >= 8;
  }
};

// Utilidades de UI
window.UIUtils = {
  /**
   * Anuncia un mensaje en la región aria-live (si existe en el DOM).
   * Para activarla, agregá en tu HTML base:
   * <div id="aria-live-region" class="visually-hidden" aria-live="polite" aria-atomic="true"></div>
   */
  announce(text) {
    try {
      const r = document.getElementById('aria-live-region');
      if (!r) return;
      // Vaciar y reasignar fuerza a los lectores a releer el texto
      r.textContent = '';
      setTimeout(() => {
        r.textContent = String(text ?? '');
      }, 100);
    } catch { /* noop */ }
  },

  showToast(text, type = 'info') {
    // Anunciar también para accesibilidad (si hay live region)
    window.UIUtils.announce?.(text);

    try {
      if (window.Toastify) {
        Toastify({ 
          text, 
          duration: 3000, 
          close: true, 
          gravity: 'top', 
          position: 'right' 
        }).showToast();
      } else {
        // Fallback para toast no disponible
      }
    } catch (e) { 
      console.log('Toast:', text); 
    }
  },

  async showAlert(options) {
    if (window.Swal && Swal.fire) {
      return await Swal.fire(options);
    }
    // Fallback para alert no disponible
    return Promise.resolve();
  },

  async confirm(text) {
    if (window.Swal && Swal.fire) {
      const result = await Swal.fire({ 
        text, 
        icon: 'question', 
        showCancelButton: true, 
        confirmButtonText: 'Sí', 
        cancelButtonText: 'No' 
      });
      return result.isConfirmed;
    }
    return window.confirm(text);
  }
};

// Utilidades de formularios
window.FormUtils = {
  sanitizePhone(input) {
    if (!input) return '';
    return input.value.replace(/[^\d+\s()-]/g, '');
  },

  validateForm(form) {
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return false;
    }
    return true;
  },

  resetForm(form) {
    form.reset();
    form.classList.remove('was-validated');
  }
};

// Utilidades de animación
window.AnimationUtils = {
  setupInViewAnimations(selector = '.prod-card, .serv-card, .home-ben, .home-cat') {
    const targets = $$(selector);
    if (!targets.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    
    targets.forEach(target => observer.observe(target));
  }
};

// Utils de búsqueda con debounce y mensajes accesibles
window.SearchUtils = {
  // Filtro con feedback accesible
  filterCards(cards, query, searchFields = ['data-tags', 'h3']) {
    const q = (query || '').toLowerCase().trim();
    let matchesCount = 0;

    if (!q) {
      cards.forEach(card => card.style.display = '');
      window.UIUtils.announce?.('Mostrando todos los productos');
      return;
    }

    cards.forEach(card => {
      let matches = false;

      searchFields.forEach(field => {
        if (field.startsWith('data-')) {
          const value = card.getAttribute(field) || '';
          if (value.toLowerCase().includes(q)) matches = true;
        } else {
          const element = card.querySelector(field);
          if (element && element.textContent.toLowerCase().includes(q)) matches = true;
        }
      });

      card.style.display = matches ? '' : 'none';
      if (matches) matchesCount++;
    });

    // Aviso accesible de resultados
    const msg = matchesCount > 0
      ? `${matchesCount} productos encontrados para "${q}"`
      : `No se encontraron productos para "${q}"`;
    window.UIUtils.announce?.(msg);
  },

  // Debounce genérico (para inputs de búsqueda)
  debounce(fn, delay = 300) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  }
};

// Utilidades de simulación de red
window.NetworkUtils = {
  async simulateNetwork(delay = 1000, failureRate = 0.1) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < failureRate) {
          reject(new Error('Simulated network error'));
        } else {
          resolve();
        }
      }, delay);
    });
  }
};

// Función global para compatibilidad
window.simulateNetwork = window.NetworkUtils.simulateNetwork;

// Inicialización común
document.addEventListener('DOMContentLoaded', () => {
  // Agregar clase JS para estilos condicionales
  document.documentElement.classList.add('js');
  
  // Configurar animaciones de entrada
  window.AnimationUtils.setupInViewAnimations();
  
  // Utilidades cargadas correctamente
});