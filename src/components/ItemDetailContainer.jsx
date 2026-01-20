import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ItemDetail from './ItemDetail';
import { getProductById } from '../firebase/firestoreService';

const ItemDetailContainer = () => {
  const { itemId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getProductById(itemId);
        setProduct(data);
      } catch (err) {
        setError('No se pudo cargar el producto.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [itemId]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!product) {
    return <div className="alert alert-warning">Producto no encontrado.</div>;
  }

  return <ItemDetail product={product} />;
};

export default ItemDetailContainer;
