import React from 'react';

const Servicios = () => {
  const servicios = [
    {
      icon: '🏥',
      title: 'Extracción a domicilio',
      description: 'Coordinamos la extracción de muestras en tu hogar o lugar de trabajo. Profesionales capacitados y material estéril garantizado.'
    },
    {
      icon: '🧪',
      title: 'Análisis clínicos generales',
      description: 'Hemograma completo, química sanguínea, perfil lipídico, función hepática y renal, entre otros estudios de rutina.'
    },
    {
      icon: '📊',
      title: 'Perfiles especializados',
      description: 'Perfiles hormonales, marcadores tumorales, serologías, inmunología y estudios de coagulación avanzados.'
    },
    {
      icon: '💉',
      title: 'Control preventivo',
      description: 'Chequeos anuales y seguimiento de parámetros de salud. Ideal para mantener un registro de tu bienestar.'
    },
    {
      icon: '⚡',
      title: 'Resultados rápidos',
      description: 'Entrega de resultados en tiempos acordados. Disponibles por email o retiro en el laboratorio.'
    },
    {
      icon: '🔬',
      title: 'Análisis de orina',
      description: 'Uroanálisis completo, cultivos y estudios especializados de muestras de orina.'
    }
  ];

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
          <h1 className="display-6 fw-bold mb-2">Nuestros servicios</h1>
          <p className="mb-0">
            Soluciones confiables para chequeos de rutina y estudios especializados
          </p>
        </div>
      </header>

      <main className="py-5">
        <div className="container">
          <div className="row g-4">
            {servicios.map((servicio, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body text-center p-4">
                    <div className="display-1 mb-3">{servicio.icon}</div>
                    <h3 className="h5 mb-3">{servicio.title}</h3>
                    <p className="text-muted mb-0">{servicio.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <section className="mt-5 py-5 bg-light rounded">
            <div className="container text-center">
              <h2 className="h4 mb-3">¿Necesitás más información?</h2>
              <p className="mb-4">
                Contactanos para coordinar tu extracción o consultar sobre nuestros servicios
              </p>
              <a href="/contacto" className="btn btn-primary btn-lg">
                <i className="bi bi-envelope me-2"></i>
                Contactanos
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Servicios;

