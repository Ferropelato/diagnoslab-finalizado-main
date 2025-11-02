import React from 'react';
import CartWidget from './CartWidget';

const Navbar = ({ welcomeMessage = 'Bienvenido a DiagnosLab', cartCount = 0 }) => {
  const navLinks = [
    { path: './index.html', label: 'Inicio' },
    { path: './pages/productos.html', label: 'Productos' },
    { path: './pages/servicios.html', label: 'Servicios' },
    { path: './pages/nosotros.html', label: 'Nosotros' },
    { path: './pages/contacto.html', label: 'Contacto' },
    { path: './pages/login.html', label: 'Iniciar Sesión' },
    { path: './pages/registro.html', label: 'Registro' },
  ];

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center gap-2" href="index.html">
            <img src="./acces/logo.png" alt="DiagnosLab" height="36" />
            <span className="fw-semibold">DiagnosLab</span>
          </a>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse"
            data-bs-target="#navbarDiagnosLab" 
            aria-controls="navbarDiagnosLab" 
            aria-expanded="false"
            aria-label="Menú"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarDiagnosLab">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {navLinks.map((link, index) => (
                <li key={index} className="nav-item">
                  <a className="nav-link" href={link.path}>
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="nav-item">
                <CartWidget itemCount={cartCount} />
              </li>
              <li className="nav-item">
                <span id="liveClock" className="nav-link small text-white-50 d-none d-lg-inline">
                  --:--:--
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {welcomeMessage && (
        <div className="alert alert-info mb-0 text-center" role="alert">
          {welcomeMessage}
        </div>
      )}
    </header>
  );
};

export default Navbar;

