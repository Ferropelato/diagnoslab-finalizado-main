import React from 'react';
import persona1 from '../../acces/persona-1.png';
import persona2 from '../../acces/persona-2.png';
import persona3 from '../../acces/persona-3.png';

const Nosotros = () => {
  const equipo = [
    {
      name: 'Dr. Juan Pérez',
      role: 'Director Médico',
      image: persona1,
      description: 'Especialista en análisis clínicos con más de 15 años de experiencia.'
    },
    {
      name: 'Lic. María González',
      role: 'Bioquímica',
      image: persona2,
      description: 'Experta en química clínica y control de calidad.'
    },
    {
      name: 'Téc. Carlos Rodríguez',
      role: 'Técnico de Laboratorio',
      image: persona3,
      description: 'Especializado en extracción y procesamiento de muestras.'
    }
  ];

  return (
    <>
      <main className="nosotros-main">
        <section
          className="nosotros-hero text-white text-center py-5"
          style={{ background: 'linear-gradient(270deg, #4dabf7, #0d6efd)' }}
        >
          <div className="container">
            <h1 className="display-5 fw-bold">Sobre Nosotros</h1>
            <p className="lead">
              DiagnosLab es un laboratorio clínico comprometido con la calidad y la atención personalizada
            </p>
          </div>
        </section>

        <section className="py-5">
          <div className="container">
            <div className="row align-items-center mb-5">
              <div className="col-lg-6">
                <h2 className="h3 mb-4">Nuestra Misión</h2>
                <p className="lead">
                  Proporcionar análisis clínicos de alta calidad con resultados confiables y oportunos,
                  contribuyendo al cuidado de la salud de nuestros pacientes.
                </p>
                <p>
                  Nos enfocamos en la excelencia técnica, el trato humano y la innovación constante
                  en nuestros procesos y equipamiento.
                </p>
              </div>
              <div className="col-lg-6">
                <h2 className="h3 mb-4">Nuestros Valores</h2>
                <ul className="list-unstyled">
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    <strong>Calidad:</strong> Controles rigurosos en cada etapa del proceso
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    <strong>Confianza:</strong> Resultados precisos y confiables
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    <strong>Compromiso:</strong> Atención personalizada y seguimiento
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    <strong>Innovación:</strong> Tecnología de vanguardia y actualización continua
                  </li>
                </ul>
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-12">
                <h2 className="h3 text-center mb-4">Nuestro Equipo</h2>
                <div className="row g-4">
                  {equipo.map((miembro, index) => (
                    <div key={index} className="col-md-4">
                      <div className="card border-0 shadow-sm text-center">
                        <div className="card-body">
                          <img
                            src={miembro.image}
                            alt={miembro.name}
                            className="rounded-circle mb-3"
                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                          />
                          <h4 className="h5">{miembro.name}</h4>
                          <p className="text-primary fw-semibold">{miembro.role}</p>
                          <p className="text-muted small">{miembro.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Nosotros;

