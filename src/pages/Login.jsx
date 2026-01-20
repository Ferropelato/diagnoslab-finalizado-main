import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { uiUtils } from '../utils/helpers';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const savedEmail = localStorage.getItem('dlab_saved_email');
    const remember = localStorage.getItem('dlab_remember_me') === 'true';
    if (savedEmail && remember) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await login(email, password);
    
    if (result.success) {
      if (rememberMe) {
        localStorage.setItem('dlab_saved_email', email);
        localStorage.setItem('dlab_remember_me', 'true');
      } else {
        localStorage.removeItem('dlab_saved_email');
        localStorage.removeItem('dlab_remember_me');
      }
      
      uiUtils.showToast(`¡Bienvenido, ${result.user.nombre}! 👋`, 'success');
      navigate('/');
    } else {
      uiUtils.showToast(result.error, 'error');
    }
  };

  const fillDemoUser = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
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
          <h1 className="display-6 fw-bold mb-2">Iniciar Sesión</h1>
          <p className="mb-0">Accede a tu cuenta de DiagnosLab</p>
        </div>
      </header>

      <main className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card shadow-lg border-0">
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <i className="bi bi-person-circle text-primary" style={{ fontSize: '3rem' }}></i>
                    <h3 className="mt-3 mb-1">¡Bienvenido de vuelta!</h3>
                    <p className="text-muted">Ingresa tus datos para acceder a tu cuenta</p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                      <label htmlFor="loginEmail" className="form-label">Email</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-envelope"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control"
                          id="loginEmail"
                          placeholder="tu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="invalid-feedback">
                        Por favor ingresa un email válido.
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="loginPassword" className="form-label">Contraseña</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-lock"></i>
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control"
                          id="loginPassword"
                          placeholder="Tu contraseña"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
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
                      <div className="invalid-feedback">
                        Por favor ingresa tu contraseña.
                      </div>
                    </div>

                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Recordarme
                      </label>
                    </div>

                    <div className="d-grid mb-3">
                      <button type="submit" className="btn btn-primary btn-lg">
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Iniciar Sesión
                      </button>
                    </div>

                    <div className="text-center">
                      <a href="#" className="text-decoration-none">
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>
                  </form>

                  <hr className="my-4" />

                  <div className="text-center">
                    <p className="mb-0">¿No tienes cuenta?</p>
                    <Link to="/registro" className="btn btn-outline-primary">
                      <i className="bi bi-person-plus me-2"></i>
                      Crear cuenta nueva
                    </Link>
                  </div>
                </div>
              </div>

              {/* Demo Users */}
              <div className="card mt-4 border-0 bg-light">
                <div className="card-body p-4">
                  <h6 className="card-title text-center mb-3">
                    <i className="bi bi-info-circle me-2"></i>
                    Usuarios de prueba
                  </h6>
                  <div className="row g-2">
                    <div className="col-6">
                      <button
                        className="btn btn-sm btn-outline-secondary w-100"
                        onClick={() => fillDemoUser('admin@diagnoslab.com', 'admin123')}
                      >
                        Admin
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        className="btn btn-sm btn-outline-secondary w-100"
                        onClick={() => fillDemoUser('usuario@diagnoslab.com', 'usuario123')}
                      >
                        Usuario
                      </button>
                    </div>
                  </div>
                  <small className="text-muted d-block mt-2 text-center">
                    Usa estos datos para probar el sistema
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;

