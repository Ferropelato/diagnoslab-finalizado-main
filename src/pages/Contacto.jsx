import React, { useState } from 'react';
import { uiUtils, validationUtils } from '../utils/helpers';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error del campo
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validationUtils.email(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.mensaje.trim()) {
      newErrors.mensaje = 'El mensaje es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      uiUtils.showToast('Por favor completa todos los campos correctamente', 'warning');
      return;
    }

    // Simular envío
    uiUtils.showToast('¡Mensaje enviado correctamente! Te contactaremos pronto 📧', 'success');
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      mensaje: ''
    });
  };

  return (
    <>
      <header
        className="text-white text-center py-5"
        style={{
          background: 'linear-gradient(270deg, #4dabf7, #0d6efd, #004085)',
          backgroundSize: '600% 600%',
          animation: 'heroGradient 15s ease infinite'
        }}
      >
        <div className="container">
          <h1 className="display-6 fw-bold mb-2">Contacto</h1>
          <p className="mb-0">Estamos aquí para ayudarte</p>
        </div>
      </header>

      <main className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mb-4 mb-lg-0">
              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  <h2 className="h4 mb-4">Enviános un mensaje</h2>
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                      <label htmlFor="nombre" className="form-label">Nombre</label>
                      <input
                        type="text"
                        className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                      />
                      {errors.nombre && (
                        <div className="invalid-feedback">{errors.nombre}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="telefono" className="form-label">Teléfono (opcional)</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="mensaje" className="form-label">Mensaje</label>
                      <textarea
                        className={`form-control ${errors.mensaje ? 'is-invalid' : ''}`}
                        id="mensaje"
                        name="mensaje"
                        rows="5"
                        value={formData.mensaje}
                        onChange={handleChange}
                        required
                      ></textarea>
                      {errors.mensaje && (
                        <div className="invalid-feedback">{errors.mensaje}</div>
                      )}
                    </div>

                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-send me-2"></i>
                      Enviar Mensaje
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm border-0 mb-3">
                <div className="card-body">
                  <h3 className="h5 mb-3">Información de contacto</h3>
                  <div className="mb-3">
                    <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                    <strong>Dirección:</strong>
                    <p className="mb-0 ms-4">Av. Principal 123, Buenos Aires</p>
                  </div>
                  <div className="mb-3">
                    <i className="bi bi-telephone-fill text-primary me-2"></i>
                    <strong>Teléfono:</strong>
                    <p className="mb-0 ms-4">+54 9 11 1234-5678</p>
                  </div>
                  <div className="mb-3">
                    <i className="bi bi-envelope-fill text-primary me-2"></i>
                    <strong>Email:</strong>
                    <p className="mb-0 ms-4">contacto@diagnoslab.com</p>
                  </div>
                  <div>
                    <i className="bi bi-clock-fill text-primary me-2"></i>
                    <strong>Horarios:</strong>
                    <p className="mb-0 ms-4">Lun - Vie: 8:00 - 18:00</p>
                    <p className="mb-0 ms-4">Sáb: 8:00 - 13:00</p>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/5491112345678"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success w-100"
                style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
              >
                <i className="bi bi-whatsapp me-2"></i>
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contacto;

