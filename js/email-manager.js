/**
 * Email Manager - Sistema de Simulación de Emails
 * Simula el envío de emails de confirmación para el registro
 */

class EmailManager {
  constructor() {
    this.pendingVerifications = new Map();
    this.verificationKey = 'dlab_pending_verifications';
    this.loadPendingVerifications();
  }

  // Cargar verificaciones pendientes desde localStorage
  loadPendingVerifications() {
    const stored = window.StorageUtils.get(this.verificationKey, {});
    this.pendingVerifications = new Map(Object.entries(stored));
  }

  // Guardar verificaciones pendientes en localStorage
  savePendingVerifications() {
    const obj = Object.fromEntries(this.pendingVerifications);
    window.StorageUtils.set(this.verificationKey, obj);
  }

  // Generar token de verificación único
  generateVerificationToken() {
    return 'verify_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Simular envío de email de confirmación
  async sendConfirmationEmail(userData) {
    const token = this.generateVerificationToken();
    const verificationData = {
      ...userData,
      token,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      verified: false
    };

    // Guardar en verificaciones pendientes
    this.pendingVerifications.set(userData.email, verificationData);
    this.savePendingVerifications();

    // Simular delay de envío
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mostrar modal con "email enviado"
    this.showEmailSentModal(userData.email, token);

    return { success: true, token };
  }

  // Mostrar modal de email enviado
  showEmailSentModal(email, token) {
    const modalHtml = `
      <div class="modal fade" id="emailSentModal" tabindex="-1" aria-labelledby="emailSentModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-success text-white">
              <h5 class="modal-title" id="emailSentModalLabel">
                <i class="bi bi-envelope-check me-2"></i>Email de Confirmación Enviado
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center">
              <div class="mb-4">
                <i class="bi bi-envelope-paper text-success" style="font-size: 4rem;"></i>
              </div>
              <h6 class="mb-3">¡Registro exitoso!</h6>
              <p class="mb-3">
                Hemos enviado un email de confirmación a:<br>
                <strong class="text-primary">${email}</strong>
              </p>
              <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                <strong>Para completar tu registro:</strong><br>
                1. Revisa tu bandeja de entrada<br>
                2. Haz clic en el enlace de verificación<br>
                3. O usa el código de verificación a continuación
              </div>
              <div class="card bg-light">
                <div class="card-body">
                  <small class="text-muted">Código de verificación:</small><br>
                  <code class="fs-5 text-primary">${token}</code>
                </div>
              </div>
              <div class="mt-3">
                <button class="btn btn-outline-primary btn-sm" onclick="window.emailManager.verifyEmail('${email}', '${token}')">
                  <i class="bi bi-check-circle me-1"></i>Verificar Ahora
                </button>
                <button class="btn btn-outline-secondary btn-sm ms-2" onclick="window.emailManager.resendEmail('${email}')">
                  <i class="bi bi-arrow-clockwise me-1"></i>Reenviar Email
                </button>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button type="button" class="btn btn-primary" onclick="window.location.href='login.html'">
                Ir a Login
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Remover modal existente si existe
    const existingModal = document.getElementById('emailSentModal');
    if (existingModal) {
      existingModal.remove();
    }

    // Agregar modal al body
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('emailSentModal'));
    modal.show();
  }

  // Verificar email con token
  async verifyEmail(email, token) {
    const verificationData = this.pendingVerifications.get(email);
    
    if (!verificationData) {
      window.UIUtils.showToast('Email no encontrado en verificaciones pendientes', 'error');
      return false;
    }

    if (verificationData.token !== token) {
      window.UIUtils.showToast('Token de verificación inválido', 'error');
      return false;
    }

    if (new Date() > new Date(verificationData.expiresAt)) {
      window.UIUtils.showToast('El token de verificación ha expirado', 'error');
      this.pendingVerifications.delete(email);
      this.savePendingVerifications();
      return false;
    }

    // Marcar como verificado
    verificationData.verified = true;
    verificationData.verifiedAt = new Date().toISOString();
    this.pendingVerifications.set(email, verificationData);
    this.savePendingVerifications();

    // Activar usuario en el sistema de autenticación
    await this.activateUser(verificationData);

    window.UIUtils.showToast('¡Email verificado exitosamente! Tu cuenta está activa', 'success');
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('emailSentModal'));
    if (modal) modal.hide();

    // Redirigir a login
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);

    return true;
  }

  // Activar usuario en el sistema de autenticación
  async activateUser(verificationData) {
    const users = window.StorageUtils.get('dlab_users', []);
    const userIndex = users.findIndex(u => u.email === verificationData.email);
    
    if (userIndex !== -1) {
      users[userIndex].verified = true;
      users[userIndex].verifiedAt = verificationData.verifiedAt;
      window.StorageUtils.set('dlab_users', users);
    }
  }

  // Reenviar email
  async resendEmail(email) {
    const verificationData = this.pendingVerifications.get(email);
    
    if (!verificationData) {
      window.UIUtils.showToast('Email no encontrado', 'error');
      return false;
    }

    // Generar nuevo token
    const newToken = this.generateVerificationToken();
    verificationData.token = newToken;
    verificationData.createdAt = new Date().toISOString();
    verificationData.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    this.pendingVerifications.set(email, verificationData);
    this.savePendingVerifications();

    window.UIUtils.showToast('Email reenviado exitosamente', 'success');
    
    // Actualizar el código en el modal
    const codeElement = document.querySelector('#emailSentModal code');
    if (codeElement) {
      codeElement.textContent = newToken;
    }

    return true;
  }

  // Verificar si un email está verificado
  isEmailVerified(email) {
    const verificationData = this.pendingVerifications.get(email);
    return verificationData && verificationData.verified;
  }

  // Limpiar verificaciones expiradas
  cleanExpiredVerifications() {
    const now = new Date();
    for (const [email, data] of this.pendingVerifications.entries()) {
      if (new Date(data.expiresAt) < now) {
        this.pendingVerifications.delete(email);
      }
    }
    this.savePendingVerifications();
  }

  // Obtener estadísticas de verificaciones
  getVerificationStats() {
    const total = this.pendingVerifications.size;
    const verified = Array.from(this.pendingVerifications.values()).filter(v => v.verified).length;
    const pending = total - verified;
    
    return { total, verified, pending };
  }
}

// Inicializar el gestor de emails
window.emailManager = new EmailManager();

// Limpiar verificaciones expiradas al cargar
document.addEventListener('DOMContentLoaded', () => {
  window.emailManager.cleanExpiredVerifications();
});

// Funciones globales para compatibilidad
window.sendConfirmationEmail = (userData) => window.emailManager.sendConfirmationEmail(userData);
window.verifyEmail = (email, token) => window.emailManager.verifyEmail(email, token);
window.isEmailVerified = (email) => window.emailManager.isEmailVerified(email);
