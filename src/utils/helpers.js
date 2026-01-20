import Toastify from 'toastify-js';
import Swal from 'sweetalert2';

// Utilidades comunes para DiagnosLab

// Formateo de moneda
export const ARS = new Intl.NumberFormat('es-AR', { 
  style: 'currency', 
  currency: 'ARS', 
  maximumFractionDigits: 0 
});

// Constantes globales
export const SITE_CONFIG = {
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
export const storageUtils = {
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
export const validationUtils = {
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
export const uiUtils = {
  announce(text) {
    try {
      const r = document.getElementById('aria-live-region');
      if (!r) return;
      r.textContent = '';
      setTimeout(() => {
        r.textContent = String(text ?? '');
      }, 100);
    } catch { /* noop */ }
  },

  showToast(text, type = 'info') {
    uiUtils.announce(text);
    const colors = {
      success: '#28a745',
      error: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8'
    };

    Toastify({
      text: text,
      duration: 3000,
      gravity: 'top',
      position: 'right',
      backgroundColor: colors[type] || colors.info,
      stopOnFocus: true
    }).showToast();
  },

  showAlert(options) {
    return Swal.fire(options);
  },

  confirm(message) {
    return Swal.fire({
      title: '¿Estás seguro?',
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => result.isConfirmed);
  }
};

// Normalizar ID de producto
export const normalizeId = (text) => {
  return (text || 'producto')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
};

// Parsear precio desde string
export const parsePrice = (priceString) => {
  if (!priceString) return 0;
  const cleaned = String(priceString).replace(/[^\d]/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

