// Gestor de notificaciones para DiagnosLab
// Maneja notificaciones del sistema y notificaciones push

class NotificationManager {
  constructor() {
    this.notifications = [];
    this.notificationsKey = 'dlab_notifications';
    this.loadNotifications();
    this.setupEventListeners();
  }

  loadNotifications() {
    this.notifications = window.StorageUtils.get(this.notificationsKey, []);
  }

  saveNotifications() {
    window.StorageUtils.set(this.notificationsKey, this.notifications);
  }

  // Crear nueva notificación
  createNotification(title, message, type = 'info', userId = null) {
    const notification = {
      id: Date.now().toString(),
      title,
      message,
      type, // info, success, warning, error
      userId,
      timestamp: new Date().toISOString(),
      read: false,
      actions: []
    };

    this.notifications.unshift(notification);
    this.saveNotifications();
    this.updateUI();
    
    // Mostrar toast si es para el usuario actual
    if (!userId || (window.authManager && window.authManager.isLoggedIn() && 
        window.authManager.getCurrentUser().email === userId)) {
      window.UIUtils.showToast(message, type);
    }

    return notification;
  }

  // Marcar notificación como leída
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.updateUI();
    }
  }

  // Marcar todas como leídas
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
    this.updateUI();
  }

  // Eliminar notificación
  deleteNotification(notificationId) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.saveNotifications();
    this.updateUI();
  }

  // Obtener notificaciones del usuario actual
  getUserNotifications() {
    if (!window.authManager || !window.authManager.isLoggedIn()) {
      return [];
    }

    const user = window.authManager.getCurrentUser();
    return this.notifications.filter(n => !n.userId || n.userId === user.email);
  }

  // Obtener notificaciones no leídas
  getUnreadCount() {
    return this.getUserNotifications().filter(n => !n.read).length;
  }

  // Actualizar UI de notificaciones
  updateUI() {
    this.updateNotificationBadge();
    this.updateNotificationDropdown();
  }

  // Actualizar badge de notificaciones
  updateNotificationBadge() {
    const badge = $('#notificationBadge');
    if (!badge) return;

    const unreadCount = this.getUnreadCount();
    if (unreadCount > 0) {
      badge.textContent = unreadCount > 99 ? '99+' : unreadCount.toString();
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  }

  // Actualizar dropdown de notificaciones
  updateNotificationDropdown() {
    const dropdown = $('#notificationDropdown');
    if (!dropdown) return;

    const notifications = this.getUserNotifications().slice(0, 5); // Mostrar solo las últimas 5

    if (notifications.length === 0) {
      dropdown.innerHTML = `
        <div class="dropdown-item text-center text-muted py-3">
          <i class="bi bi-bell-slash" style="font-size: 2rem;"></i>
          <div class="mt-2">No hay notificaciones</div>
        </div>
      `;
      return;
    }

    dropdown.innerHTML = notifications.map(notification => `
      <div class="dropdown-item ${!notification.read ? 'bg-light' : ''}" 
           onclick="notificationManager.markAsRead('${notification.id}')">
        <div class="d-flex align-items-start">
          <div class="me-2">
            <i class="bi bi-${this.getNotificationIcon(notification.type)} text-${this.getNotificationColor(notification.type)}"></i>
          </div>
          <div class="flex-grow-1">
            <div class="fw-semibold">${notification.title}</div>
            <div class="small text-muted">${notification.message}</div>
            <div class="small text-muted">${this.formatTimestamp(notification.timestamp)}</div>
          </div>
          ${!notification.read ? '<div class="badge bg-primary rounded-circle" style="width: 8px; height: 8px;"></div>' : ''}
        </div>
      </div>
    `).join('') + `
      <div class="dropdown-divider"></div>
      <div class="dropdown-item text-center">
        <a href="pages/notificaciones.html" class="btn btn-sm btn-outline-primary">
          Ver todas las notificaciones
        </a>
      </div>
    `;
  }

  // Obtener icono según el tipo de notificación
  getNotificationIcon(type) {
    const icons = {
      'info': 'info-circle',
      'success': 'check-circle',
      'warning': 'exclamation-triangle',
      'error': 'x-circle'
    };
    return icons[type] || 'bell';
  }

  // Obtener color según el tipo de notificación
  getNotificationColor(type) {
    const colors = {
      'info': 'primary',
      'success': 'success',
      'warning': 'warning',
      'error': 'danger'
    };
    return colors[type] || 'secondary';
  }

  // Formatear timestamp
  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) { // Menos de 1 minuto
      return 'Hace un momento';
    } else if (diff < 3600000) { // Menos de 1 hora
      const minutes = Math.floor(diff / 60000);
      return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else if (diff < 86400000) { // Menos de 1 día
      const hours = Math.floor(diff / 3600000);
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('es-AR');
    }
  }

  // Configurar event listeners
  setupEventListeners() {
    // Botón de marcar todas como leídas
    document.addEventListener('click', (e) => {
      if (e.target.id === 'markAllAsRead') {
        this.markAllAsRead();
        window.UIUtils.showToast('Todas las notificaciones marcadas como leídas', 'success');
      }
    });

    // Actualizar notificaciones cuando cambie el usuario
    if (window.authManager) {
      const originalUpdateUI = window.authManager.updateUI.bind(window.authManager);
      window.authManager.updateUI = () => {
        originalUpdateUI();
        this.updateUI();
      };
    }
  }

  // Notificaciones del sistema
  createSystemNotification(title, message, type = 'info') {
    return this.createNotification(title, message, type, 'system');
  }

  // Notificación de nuevo pedido
  createOrderNotification(orderId, status) {
    const statusTexts = {
      'pendiente': 'Tu pedido ha sido recibido y está siendo procesado',
      'procesando': 'Tu pedido está siendo preparado',
      'enviado': 'Tu pedido ha sido enviado',
      'entregado': 'Tu pedido ha sido entregado',
      'cancelado': 'Tu pedido ha sido cancelado'
    };

    const statusColors = {
      'pendiente': 'info',
      'procesando': 'warning',
      'enviado': 'primary',
      'entregado': 'success',
      'cancelado': 'error'
    };

    return this.createNotification(
      `Pedido #${orderId}`,
      statusTexts[status] || 'Tu pedido ha sido actualizado',
      statusColors[status] || 'info',
      window.authManager?.getCurrentUser()?.email
    );
  }

  // Notificación de promoción
  createPromotionNotification(title, message) {
    return this.createNotification(
      title,
      message,
      'success',
      'all' // Para todos los usuarios
    );
  }

  // Notificación de mantenimiento
  createMaintenanceNotification(message) {
    return this.createNotification(
      'Mantenimiento Programado',
      message,
      'warning',
      'all'
    );
  }
}

// Inicializar el gestor de notificaciones
window.notificationManager = new NotificationManager();

// Funciones globales para compatibilidad
window.createNotification = (title, message, type) => window.notificationManager.createNotification(title, message, type);
window.markNotificationAsRead = (id) => window.notificationManager.markAsRead(id);
window.getUnreadNotificationCount = () => window.notificationManager.getUnreadCount();
