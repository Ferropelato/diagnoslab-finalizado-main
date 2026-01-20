import React from 'react';

const Footer = () => {
  return (
    <footer
      className="footer-diag text-white text-center py-4"
      style={{ background: 'linear-gradient(270deg, #4dabf7, #0d6efd)' }}
    >
      <div className="container">
        <p className="mb-0">
          © 2025 DiagnosLab - Todos los derechos reservados. by Fer Ropelato
        </p>
        <div className="mt-2">
          <a href="https://www.facebook.com" className="text-white me-3" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="https://www.instagram.com" className="text-white me-3" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="https://www.whatsapp.com" className="text-white" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-whatsapp"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

