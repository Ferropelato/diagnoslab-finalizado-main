// Gestor de autenticación para DiagnosLab
// Maneja login, logout, registro y sesiones de usuario

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.sessionKey = 'dlab_user_session';
    this.usersKey = window.SITE_CONFIG.storageKeys.users;
    this.init();
  }

  init() {
    this.loadSession();
    this.setupEventListeners();
  }

  // Cargar sesión existente
  loadSession() {
    try {
      const sessionData = localStorage.getItem(this.sessionKey);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        // Verificar si la sesión no ha expirado (24 horas)
        if (new Date().getTime() - session.timestamp < 24 * 60 * 60 * 1000) {
          this.currentUser = session.user;
          this.updateUI();
          return true;
        } else {
          this.logout();
        }
      }
    } catch (e) {
      console.error('Error cargando sesión:', e);
      this.logout();
    }
    return false;
  }

  // Guardar sesión
  saveSession(user) {
    const sessionData = {
      user: user,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
  }

  // Login
  async login(email, password) {
    try {
      const users = window.StorageUtils.get(this.usersKey, []);
      const user = users.find(u => u.email === email.toLowerCase());
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña (en un proyecto real usarías hash)
      if (user.pass !== password) {
        throw new Error('Contraseña incorrecta');
      }

      this.currentUser = {
        id: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
        direccion: user.direccion,
        createdAt: user.createdAt
      };

      this.saveSession(this.currentUser);
      this.updateUI();
      
      window.UIUtils.showToast(`¡Bienvenido, ${user.nombre}! 👋`, 'success');
      return true;
    } catch (error) {
      window.UIUtils.showToast(error.message, 'error');
      return false;
    }
  }

  // Logout
  logout() {
    this.currentUser = null;
    localStorage.removeItem(this.sessionKey);
    this.updateUI();
    window.UIUtils.showToast('Sesión cerrada', 'info');
  }

  // Registro
  async register(userData) {
    try {
      const users = window.StorageUtils.get(this.usersKey, []);
      
      // Verificar si el usuario ya existe
      if (users.some(u => u.email === userData.email.toLowerCase())) {
        throw new Error('Ya existe un usuario con este email');
      }

      // Validar datos
      if (!window.ValidationUtils.email(userData.email)) {
        throw new Error('Email inválido');
      }

      if (!window.ValidationUtils.password(userData.pass)) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
      }

      if (userData.pass !== userData.pass2) {
        throw new Error('Las contraseñas no coinciden');
      }

      // Crear nuevo usuario
      const newUser = {
        id: Date.now().toString(),
        nombre: userData.nombre.trim(),
        apellido: userData.apellido.trim(),
        email: userData.email.toLowerCase().trim(),
        telefono: userData.telefono.trim(),
        direccion: userData.direccion?.trim() || '',
        pass: userData.pass,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        orders: []
      };

      users.push(newUser);
      window.StorageUtils.set(this.usersKey, users);

      // Enviar email de confirmación si el email manager está disponible
      if (window.emailManager) {
        await window.emailManager.sendConfirmationEmail(newUser);
        // No hacer auto-login, esperar verificación
        window.UIUtils.showToast('¡Registro exitoso! Revisa tu email para verificar tu cuenta 📧', 'success');
      } else {
        // Auto-login después del registro (modo sin verificación)
        this.currentUser = {
          id: newUser.email,
          nombre: newUser.nombre,
          apellido: newUser.apellido,
          email: newUser.email,
          telefono: newUser.telefono,
          direccion: newUser.direccion,
          createdAt: newUser.createdAt
        };

        this.saveSession(this.currentUser);
        this.updateUI();
        
        window.UIUtils.showToast('¡Registro exitoso! Bienvenido a DiagnosLab 🎉', 'success');
      }
      
      return true;
    } catch (error) {
      window.UIUtils.showToast(error.message, 'error');
      return false;
    }
  }

  // Verificar si el usuario está logueado
  isLoggedIn() {
    return this.currentUser !== null;
  }

  // Obtener usuario actual
  getCurrentUser() {
    return this.currentUser;
  }

  // Actualizar UI según el estado de login
  updateUI() {
    this.updateNavbar();
    this.updateLoginForms();
    this.updateUserSpecificElements();
  }

  // Actualizar navbar
  updateNavbar() {
    const loginLink = $('#loginLink');
    const registerLink = $('#registerLink');
    const userMenu = $('#userMenu');
    const notificationMenu = $('#notificationMenu');
    const userInfo = $('#userInfo');

    if (this.isLoggedIn()) {
      // Mostrar menú de usuario y notificaciones
      if (loginLink) loginLink.style.display = 'none';
      if (registerLink) registerLink.style.display = 'none';
      if (userMenu) userMenu.style.display = 'block';
      if (notificationMenu) notificationMenu.style.display = 'block';
      if (userInfo) {
        userInfo.innerHTML = `
          <span class="text-white">Hola, ${this.currentUser.nombre}</span>
          <div class="dropdown">
            <button class="btn btn-link text-white dropdown-toggle" type="button" data-bs-toggle="dropdown">
              <i class="bi bi-person-circle"></i>
            </button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="pages/perfil.html"><i class="bi bi-person"></i> Mi Perfil</a></li>
              <li><a class="dropdown-item" href="pages/pedidos.html"><i class="bi bi-bag"></i> Mis Pedidos</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#" id="logoutBtn"><i class="bi bi-box-arrow-right"></i> Cerrar Sesión</a></li>
            </ul>
          </div>
        `;
      }
    } else {
      // Mostrar enlaces de login/registro
      if (loginLink) loginLink.style.display = 'block';
      if (registerLink) registerLink.style.display = 'block';
      if (userMenu) userMenu.style.display = 'none';
      if (notificationMenu) notificationMenu.style.display = 'none';
    }
  }

  // Actualizar formularios de login
  updateLoginForms() {
    const loginForm = $('#loginForm');
    const registerForm = $('#registerForm');

    if (this.isLoggedIn()) {
      if (loginForm) loginForm.style.display = 'none';
      if (registerForm) registerForm.style.display = 'none';
    }
  }

  // Actualizar elementos específicos del usuario
  updateUserSpecificElements() {
    // Actualizar carrito con información del usuario
    if (window.cartManager) {
      window.cartManager.updateUI();
    }
  }

  // Configurar event listeners
  setupEventListeners() {
    // Login form
    const loginForm = $('#loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = $('#loginEmail')?.value.trim();
        const password = $('#loginPassword')?.value;
        
        if (email && password) {
        const success = await this.login(email, password);
        if (success) {
          // Detectar si estamos en una subcarpeta
          const isInSubfolder = window.location.pathname.includes('/pages/');
          window.location.href = isInSubfolder ? '../index.html' : 'index.html';
        }
        }
      });
    }

    // Register form
    const registerForm = $('#registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
          nombre: $('#regName')?.value.trim(),
          apellido: $('#regLast')?.value.trim(),
          email: $('#regEmail')?.value.trim(),
          telefono: $('#regPhone')?.value.trim(),
          direccion: $('#regAddress')?.value.trim(),
          pass: $('#regPass')?.value,
          pass2: $('#regPass2')?.value
        };
        
        const success = await this.register(formData);
        if (success) {
          // Detectar si estamos en una subcarpeta
          const isInSubfolder = window.location.pathname.includes('/pages/');
          window.location.href = isInSubfolder ? '../index.html' : 'index.html';
        }
      });
    }

    // Logout button
    document.addEventListener('click', (e) => {
      if (e.target.id === 'logoutBtn') {
        e.preventDefault();
        this.logout();
        // Detectar si estamos en una subcarpeta
        const isInSubfolder = window.location.pathname.includes('/pages/');
        window.location.href = isInSubfolder ? '../index.html' : 'index.html';
      }
    });

    // Proteger rutas que requieren login
    this.protectRoutes();
  }

  // Proteger rutas que requieren autenticación
  protectRoutes() {
    const protectedPages = ['perfil.html', 'pedidos.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !this.isLoggedIn()) {
      window.UIUtils.showToast('Debes iniciar sesión para acceder a esta página', 'warning');
      // Detectar si estamos en una subcarpeta
      const isInSubfolder = window.location.pathname.includes('/pages/');
      window.location.href = isInSubfolder ? 'login.html' : 'pages/login.html';
    }
  }

  // Actualizar perfil de usuario
  async updateProfile(profileData) {
    try {
      if (!this.isLoggedIn()) {
        throw new Error('Usuario no autenticado');
      }

      const users = window.StorageUtils.get(this.usersKey, []);
      const userIndex = users.findIndex(u => u.email === this.currentUser.email);
      
      if (userIndex === -1) {
        throw new Error('Usuario no encontrado');
      }

      // Actualizar datos del usuario
      users[userIndex] = {
        ...users[userIndex],
        nombre: profileData.nombre.trim(),
        apellido: profileData.apellido.trim(),
        telefono: profileData.telefono.trim(),
        direccion: profileData.direccion?.trim() || ''
      };

      window.StorageUtils.set(this.usersKey, users);

      // Actualizar usuario actual
      this.currentUser = {
        ...this.currentUser,
        nombre: profileData.nombre.trim(),
        apellido: profileData.apellido.trim(),
        telefono: profileData.telefono.trim(),
        direccion: profileData.direccion?.trim() || ''
      };

      this.saveSession(this.currentUser);
      this.updateUI();
      
      window.UIUtils.showToast('Perfil actualizado correctamente', 'success');
      return true;
    } catch (error) {
      window.UIUtils.showToast(error.message, 'error');
      return false;
    }
  }

  // Cambiar contraseña
  async changePassword(currentPassword, newPassword) {
    try {
      if (!this.isLoggedIn()) {
        throw new Error('Usuario no autenticado');
      }

      const users = window.StorageUtils.get(this.usersKey, []);
      const userIndex = users.findIndex(u => u.email === this.currentUser.email);
      
      if (userIndex === -1) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña actual
      if (users[userIndex].pass !== currentPassword) {
        throw new Error('Contraseña actual incorrecta');
      }

      // Validar nueva contraseña
      if (!window.ValidationUtils.password(newPassword)) {
        throw new Error('La nueva contraseña debe tener al menos 8 caracteres');
      }

      // Actualizar contraseña
      users[userIndex].pass = newPassword;
      window.StorageUtils.set(this.usersKey, users);
      
      window.UIUtils.showToast('Contraseña actualizada correctamente', 'success');
      return true;
    } catch (error) {
      window.UIUtils.showToast(error.message, 'error');
      return false;
    }
  }
}

// Inicializar el gestor de autenticación
window.authManager = new AuthManager();

// Funciones globales para compatibilidad
window.login = (email, password) => window.authManager.login(email, password);
window.logout = () => window.authManager.logout();
window.isLoggedIn = () => window.authManager.isLoggedIn();
window.getCurrentUser = () => window.authManager.getCurrentUser();
