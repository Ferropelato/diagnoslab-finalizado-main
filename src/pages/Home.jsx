import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNewsletter } from '../utils/hooks';
import { uiUtils, validationUtils } from '../utils/helpers';
import carrusel1 from '../../acces/carrusel-1.png';
import carrusel2 from '../../acces/carrusel-2.png';
import carrusel3 from '../../acces/carrusel-3.png';
import sangreImg from '../../acces/analisis sangre.png';
import orinaImg from '../../acces/analisis orina.png';
import aparatosImg from '../../acces/aparatos.png';
import especialesImg from '../../acces/especiales.png';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const { subscribe } = useNewsletter();

  const slides = [
    {
      image: carrusel3,
      title: 'Diagnósticos confiables',
      description: 'Resultados claros y a tiempo para tu tranquilidad.'
    },
    {
      image: carrusel2,
      title: 'Profesionales a tu servicio',
      description: 'Atención humana y protocolos estandarizados.'
    },
    {
      image: carrusel1,
      title: 'Extracción y procesamiento',
      description: 'Calidad y seguridad en cada muestra.'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      text: "Excelente servicio, muy profesionales. Los resultados llegaron a tiempo y fueron muy claros. Definitivamente los recomiendo.",
      author: "María González",
      role: "Paciente desde 2023"
    },
    {
      text: "La atención a domicilio es increíble. Muy cómodo y seguro. Los profesionales son muy cuidadosos y amables.",
      author: "Carlos Rodríguez",
      role: "Cliente frecuente"
    },
    {
      text: "DiagnosLab me salvó el día. Necesitaba resultados urgentes y los entregaron antes de lo prometido. ¡Gracias!",
      author: "Ana Martínez",
      role: "Paciente desde 2022"
    },
    {
      text: "La calidad del servicio es excepcional. Equipos modernos y personal muy capacitado. Los recomiendo sin dudar.",
      author: "Roberto Silva",
      role: "Cliente corporativo"
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setEmailError('');

    if (!email || !validationUtils.email(email)) {
      setEmailError('Ingresá un email válido (ej: usuario@dominio.com).');
      return;
    }

    const result = subscribe(email);
    if (result.success) {
      uiUtils.showToast(result.message, 'success');
      setEmail('');
    } else {
      uiUtils.showToast(result.message, 'warning');
    }
  };

  return (
    <>
      {/* Carousel */}
      <div id="carouselDiag" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#carouselDiag"
              data-bs-slide-to={index}
              className={index === currentSlide ? 'active' : ''}
              aria-current={index === currentSlide ? 'true' : undefined}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
        <div className="carousel-inner">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`carousel-item ${index === currentSlide ? 'active' : ''}`}
            >
              <img
                src={slide.image}
                className="d-block w-100"
                alt={slide.title}
                style={{ height: '650px', objectFit: 'cover' }}
              />
              <div className="carousel-caption d-none d-md-block">
                <h5>{slide.title}</h5>
                <p>{slide.description}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselDiag"
          data-bs-slide="prev"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselDiag"
          data-bs-slide="next"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>

      {/* Categorías */}
      <section className="home-categorias py-5 bg-white">
        <div className="container">
          <h2 className="h3 text-center mb-4">Categorías</h2>
          <div className="home-categorias__grid">
            <Link className="home-cat" to="/productos">
              <img src={sangreImg} alt="Análisis de sangre" />
              <span>Sangre</span>
            </Link>
            <Link className="home-cat" to="/productos">
              <img src={orinaImg} alt="Análisis de orina" />
              <span>Orina</span>
            </Link>
            <Link className="home-cat" to="/productos">
              <img src={aparatosImg} alt="Respiratorio" />
              <span>Equipos</span>
            </Link>
            <Link className="home-cat" to="/productos">
              <img src={especialesImg} alt="Perfiles especializados" />
              <span>Especializados</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="home-beneficios py-5">
        <div className="container">
          <h2 className="h3 text-center mb-4">¿Por qué elegirnos?</h2>
          <div className="home-beneficios__grid">
            <div className="home-ben">
              <div className="home-ben__ico">🧪</div>
              <h3>Calidad certificada</h3>
              <p>Equipos calibrados y controles de calidad permanentes.</p>
            </div>
            <div className="home-ben">
              <div className="home-ben__ico">⚡</div>
              <h3>Resultados a tiempo</h3>
              <p>Entregas claras y dentro de los plazos comprometidos.</p>
            </div>
            <div className="home-ben">
              <div className="home-ben__ico">🏥</div>
              <h3>Extracción a domicilio</h3>
              <p>Coordinación simple para tu comodidad y seguridad.</p>
            </div>
            <div className="home-ben">
              <div className="home-ben__ico">💬</div>
              <h3>Atención humana</h3>
              <p>Acompañamiento y comunicación profesional.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta py-5 text-center text-white">
        <div className="container">
          <h2 className="h3 mb-3">Ver catálogo completo</h2>
          <p className="mb-4">
            Encontrá estudios por categoría y agregalos a tu pedido.
          </p>
          <Link className="btn btn-light btn-lg" to="/productos">
            Explorar productos
          </Link>
        </div>
      </section>

      {/* Mapas */}
      <section className="home-mapas py-5 bg-white">
        <div className="container">
          <h2 className="h4 text-center mb-4">Cómo llegar & referencias</h2>
          <div className="home-mapas__grid">
            <a
              className="home-link"
              href="https://maps.google.com/?q=DiagnosLab"
              target="_blank"
              rel="noopener noreferrer"
            >
              📍 Ver ubicación en Google Maps
            </a>
            <a
              className="home-link"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 Descargá referencias (PDF)
            </a>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="home-testimonials py-5 bg-light">
        <div className="container">
          <h2 className="h3 text-center mb-4">Lo que dicen nuestros clientes</h2>
          <div className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  data-bs-target="#testimonialsCarousel"
                  data-bs-slide-to={index}
                  className={index === currentTestimonial ? 'active' : ''}
                />
              ))}
            </div>
            <div className="carousel-inner">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === currentTestimonial ? 'active' : ''}`}
                >
                  <div className="testimonial-card">
                    <div className="testimonial-content">
                      <div className="stars">⭐⭐⭐⭐⭐</div>
                      <p className="testimonial-text">"{testimonial.text}"</p>
                      <div className="testimonial-author">
                        <strong>{testimonial.author}</strong>
                        <span>{testimonial.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="home-news py-5">
        <div className="container">
          <h2 className="h4 text-center mb-3">Recibí novedades</h2>
          <form className="home-news__form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Tu email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
              }}
              required
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
            />
            {emailError && (
              <div className="invalid-feedback" style={{ display: 'block', fontSize: '.85rem', color: '#dc3545', minHeight: '1.2em' }}>
                {emailError}
              </div>
            )}
            <button type="submit">Suscribirme</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Home;

