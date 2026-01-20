import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { uiUtils } from '../utils/helpers';

const Perfil = () => {
  const { currentUser, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        nombre: currentUser.nombre || '',
        apellido: currentUser.apellido || '',
        telefono: currentUser.telefono || '',
        direccion: currentUser.direccion || ''
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateProfile(formData);
    
    if (result.success) {
      uiUtils.showToast('Perfil actualizado correctamente', 'success');
    } else {
      uiUtils.showToast(result.error, 'error');
    }
    
    setLoading(false);
  };

  if (!currentUser) {
    return null;
  }

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
          <h1 className="display-6 fw-bold mb-2">Mi Perfil</h1>
          <p className="mb-0">Gestiona tu información personal</p>
        </div>
      </header>

      <main className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  <div className="text-center mb-4">
                    <i className="bi bi-person-circle text-primary" style={{ fontSize: '4rem' }}></i>
                    <h3 className="mt-3">{currentUser.nombre} {currentUser.apellido}</h3>
                    <p className="text-muted">{currentUser.email}</p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input
                          type="text"
                          className="form-control"
                          id="nombre"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="apellido" className="form-label">Apellido</label>
                        <input
                          type="text"
                          className="form-control"
                          id="apellido"
                          name="apellido"
                          value={formData.apellido}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={currentUser.email}
                        disabled
                      />
                      <small className="text-muted">El email no se puede modificar</small>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="telefono" className="form-label">Teléfono</label>
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
                      <label htmlFor="direccion" className="form-label">Dirección</label>
                      <input
                        type="text"
                        className="form-control"
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-save me-2"></i>
                            Guardar Cambios
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Perfil;

