import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useLiveClock } from '../utils/hooks';
import CartWidget from './CartWidget';
import logo from '../../acces/logo.png';

const Navbar = () => {
  const { currentUser, logout, isLoggedIn } = useAuth();
  const { getTotals } = useCart();
  const navigate = useNavigate();
  const time = useLiveClock();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const categories = [
    { id: 'sangre', name: 'Tubos sangre' },
    { id: 'orina', name: 'Orina' },
    { id: 'otros', name: 'Otros insumos' },
    { id: 'aparatologia', name: 'Aparatología' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const cartCount = getTotals().totalItems;

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <img src={logo} alt="DiagnosLab" height="36" />
            <span className="fw-semibold">DiagnosLab</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarDiagnosLab"
            aria-controls="navbarDiagnosLab"
            aria-expanded="false"
            aria-label="Menú"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarDiagnosLab">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={() => setIsMenuOpen(false)}>
                  Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/productos" onClick={() => setIsMenuOpen(false)}>
                  Productos
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Categorías
                </a>
                <ul className="dropdown-menu">
                  {categories.map(category => (
                    <li key={category.id}>
                      <Link
                        className="dropdown-item"
                        to={`/category/${category.id}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/servicios" onClick={() => setIsMenuOpen(false)}>
                  Servicios
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/nosotros" onClick={() => setIsMenuOpen(false)}>
                  Nosotros
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contacto" onClick={() => setIsMenuOpen(false)}>
                  Contacto
                </Link>
              </li>
              {!isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login" onClick={() => setIsMenuOpen(false)}>
                      Iniciar Sesión
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/registro" onClick={() => setIsMenuOpen(false)}>
                      Registro
                    </Link>
                  </li>
                </>
              ) : (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    {currentUser?.nombre}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/perfil" onClick={() => setIsMenuOpen(false)}>
                        <i className="bi bi-person me-2"></i>Mi Perfil
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/pedidos" onClick={() => setIsMenuOpen(false)}>
                        <i className="bi bi-bag me-2"></i>Mis Pedidos
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                      </button>
                    </li>
                  </ul>
                </li>
              )}
              <li className="nav-item">
                <CartWidget itemCount={cartCount} />
              </li>
              <li className="nav-item">
                <span className="nav-link small text-white-50 d-none d-lg-inline">
                  {time}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

