(function formsModule() {
  // Usar utilidades comunes

  const contactForm = $('#contactForm');
  if (contactForm) {
    const nameEl = $('#contactName', contactForm);
    const emailEl = $('#contactEmail', contactForm);
    const phoneEl = $('#contactPhone', contactForm);
    const msgEl = $('#contactMessage', contactForm);

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!window.FormUtils.validateForm(contactForm)) return;
      
      const payload = {
        nombre: nameEl.value.trim(),
        email: emailEl.value.trim(),
        telefono: phoneEl.value.trim(),
        mensaje: msgEl.value.trim(),
        fecha: new Date().toISOString()
      };
      
      const list = window.StorageUtils.get(window.SITE_CONFIG.storageKeys.messages, []);
      list.push(payload);
      window.StorageUtils.set(window.SITE_CONFIG.storageKeys.messages, list);

      window.UIUtils.showToast('✅ ¡Gracias por tu mensaje! Te responderemos pronto.', 'success');
      window.FormUtils.resetForm(contactForm);
    });

    phoneEl?.addEventListener('input', () => {
      phoneEl.value = window.FormUtils.sanitizePhone(phoneEl);
    });
  }

  const regForm = $('#registerForm');
  if (regForm) {
    const nameEl  = $('#regName', regForm);
    const lastEl  = $('#regLast', regForm);
    const emailEl = $('#regEmail', regForm);
    const phoneEl = $('#regPhone', regForm);
    const pass1El = $('#regPass', regForm);
    const pass2El = $('#regPass2', regForm);
    const addrEl  = $('#regAddress', regForm);
    const termsEl = $('#regTerms', regForm);

    const validatePasswords = () => {
      const ok = pass1El.value.length >= 8 && pass1El.value === pass2El.value;
      pass2El.setCustomValidity(ok ? '' : 'Las contraseñas no coinciden o tienen menos de 8 caracteres');
    };
    ['input','blur'].forEach(evt => {
      pass1El?.addEventListener(evt, validatePasswords);
      pass2El?.addEventListener(evt, validatePasswords);
    });

    phoneEl?.addEventListener('input', () => {
      phoneEl.value = window.FormUtils.sanitizePhone(phoneEl);
    });

    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      validatePasswords();
      if (!window.FormUtils.validateForm(regForm)) return;
      
      if (!termsEl.checked) {
        window.UIUtils.showToast('⚠️ Debés aceptar los términos para continuar.', 'warning');
        termsEl.focus();
        return;
      }

      const user = {
        nombre: nameEl.value.trim(),
        apellido: lastEl.value.trim(),
        email: emailEl.value.trim().toLowerCase(),
        telefono: phoneEl.value.trim(),
        direccion: (addrEl?.value || '').trim(),
        pass: pass1El.value,
        createdAt: new Date().toISOString()
      };

      const users = window.StorageUtils.get(window.SITE_CONFIG.storageKeys.users, []);
      const exists = users.some(u => u.email === user.email);
      if (exists) {
        window.UIUtils.showToast('⚠️ Ya existe un usuario con este email.', 'warning');
        return;
      }

      users.push(user);
      window.StorageUtils.set(window.SITE_CONFIG.storageKeys.users, users);

      if (confirm('✅ Registro exitoso. ¿Querés ir al inicio?')) {
        window.location.href = '../index.html';
      } else {
        window.FormUtils.resetForm(regForm);
      }
    });
  }

  const newsForm = $('#newsletterForm');
  if (newsForm) {
    const emailEl = $('#newsEmail', newsForm);
    const freqEl  = $('#newsFreq', newsForm);
    const consEl  = $('#newsConsent', newsForm);

    newsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!window.FormUtils.validateForm(newsForm)) return;
      
      if (!consEl.checked) {
        if (!confirm('No marcaste consentimiento. ¿Confirmás igualmente la suscripción?')) {
          return;
        }
      }

      const sub = {
        email: (emailEl.value || '').trim().toLowerCase(),
        frecuencia: freqEl.value,
        consent: !!consEl.checked,
        createdAt: new Date().toISOString()
      };

      const subs = window.StorageUtils.get(window.SITE_CONFIG.storageKeys.newsSubs, []);
      const exists = subs.some(s => s.email === sub.email);
      if (exists) {
        window.UIUtils.showToast('⚠️ Ese email ya está suscripto.', 'warning');
        return;
      }

      subs.push(sub);
      window.StorageUtils.set(window.SITE_CONFIG.storageKeys.newsSubs, subs);

      window.UIUtils.showToast('✅ ¡Suscripción registrada! Te enviaremos novedades.', 'success');
      window.FormUtils.resetForm(newsForm);
    });
  }
})();

// Código duplicado eliminado - ya está manejado arriba