import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ItemList from './ItemList';
import { getProducts, getProductsByCategory } from '../firebase/firestoreService';

const categories = [
  { id: 'sangre', name: 'Tubos sangre' },
  { id: 'orina', name: 'Orina' },
  { id: 'otros', name: 'Otros insumos' },
  { id: 'aparatologia', name: 'Aparatología' }
];

const ItemListContainer = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const data = categoryId
          ? await getProductsByCategory(categoryId)
          : await getProducts();
        setProducts(data);
      } catch (err) {
        setError('No se pudieron cargar los productos.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return products;
    return products.filter(product =>
      product.title.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      (product.tags || '').toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

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
          <h1 className="display-6 fw-bold mb-2">Catálogo de productos</h1>
          <p className="mb-0">Encontrá los insumos para tu laboratorio</p>
        </div>
      </header>

      <main className="productos-main py-5">
        <div className="container">
          <div className="row g-3 align-items-center mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Buscar producto (ej: EDTA, orina, centrífuga)…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                <Link
                  className={`btn btn-sm ${!categoryId ? 'btn-primary' : 'btn-outline-primary'}`}
                  to="/productos"
                >
                  Todos
                </Link>
                {categories.map(category => (
                  <Link
                    key={category.id}
                    className={`btn btn-sm ${
                      categoryId === category.id ? 'btn-primary' : 'btn-outline-primary'
                    }`}
                    to={`/category/${category.id}`}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="text-center text-muted py-5">
              No hay productos para mostrar.
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <ItemList products={filteredProducts} />
          )}
        </div>
      </main>
    </>
  );
};

export default ItemListContainer;
