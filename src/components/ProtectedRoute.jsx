import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { uiUtils } from '../utils/helpers';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    uiUtils.showToast('Debes iniciar sesión para acceder a esta página', 'warning');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

