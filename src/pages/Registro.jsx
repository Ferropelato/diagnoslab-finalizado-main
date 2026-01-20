import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { uiUtils } from '../utils/helpers';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    pass: '',
    pass2: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await register(formData);
    
    if (result.success) {
      uiUtils.showToast('¡Registro exitoso! Bienvenido a DiagnosLab 🎉', 'success');
      navigate('/');
    } else {
      uiUtils.showToast(result.error, 'error');
    }
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
          <h1 className="display-6 fw-bold mb-2">Crear Cuenta</h1>
          <p className="mb-0">Regístrate en DiagnosLab</p>
        </div>
      </header>

      <main className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow-lg border-0">
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <i className="bi bi-person-plus text-primary" style={{ fontSize: '3rem' }}></i>
                    <h3 className="mt-3 mb-1">¡Únete a DiagnosLab!</h3>
                    <p className="text-muted">Completa tus datos para crear tu cuenta</p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="regName" className="form-label">Nombre</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-person"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            id="regName"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="regLast" className="form-label">Apellido</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-person"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            id="regLast"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="regEmail" className="form-label">Email</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-envelope"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control"
                          id="regEmail"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="regPhone" className="form-label">Teléfono</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-phone"></i>
                        </span>
                        <input
                          type="tel"
                          className="form-control"
                          id="regPhone"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="regAddress" className="form-label">Dirección</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-geo-alt"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="regAddress"
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="regPass" className="form-label">Contraseña</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-lock"></i>
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control"
                          id="regPass"
                          name="pass"
                          value={formData.pass}
                          onChange={handleChange}
                          minLength="8"
                          required
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                        </button>
                      </div>
                      <small className="text-muted">Mínimo 8 caracteres</small>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="regPass2" className="form-label">Confirmar Contraseña</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-lock-fill"></i>
                        </span>
                        <input
                          type={showPassword2 ? 'text' : 'password'}
                          className="form-control"
                          id="regPass2"
                          name="pass2"
                          value={formData.pass2}
                          onChange={handleChange}
                          required
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setShowPassword2(!showPassword2)}
                        >
                          <i className={`bi bi-eye${showPassword2 ? '-slash' : ''}`}></i>
                        </button>
                      </div>
                    </div>

                    <div className="d-grid mb-3">
                      <button type="submit" className="btn btn-primary btn-lg">
                        <i className="bi bi-person-plus me-2"></i>
                        Crear Cuenta
                      </button>
                    </div>
                  </form>

                  <hr className="my-4" />

                  <div className="text-center">
                    <p className="mb-0">¿Ya tienes cuenta?</p>
                    <Link to="/login" className="btn btn-outline-primary">
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Iniciar Sesión
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Registro;

