import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { ARS, uiUtils } from '../utils/helpers';
import { resolveProductImage } from '../utils/productImages';
import ItemCount from './ItemCount';

const ItemDetail = ({ product }) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (qty) => {
    const result = addItem(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        image: resolveProductImage(product),
        stock: product.stock
      },
      qty
    );

    if (result.success) {
      uiUtils.showToast('Producto agregado al carrito ✅', 'success');
      setAdded(true);
    } else {
      uiUtils.showToast(result.error || 'Error al agregar producto', 'error');
    }
  };

  return (
    <main className="py-5">
      <div className="container">
        <div className="row g-4 align-items-start">
          <div className="col-lg-6">
            <img src={resolveProductImage(product)} alt={product.title} className="img-fluid rounded" />
          </div>
          <div className="col-lg-6">
            <h1 className="h3 fw-bold">{product.title}</h1>
            <p className="text-muted">{product.description}</p>
            <div className="h4 text-primary mb-3">{ARS.format(product.price)}</div>
            {product.meta?.length > 0 && (
              <ul className="prod-meta">
                {product.meta.map((meta, index) => (
                  <li key={`${product.id}-detail-${index}`}>{meta}</li>
                ))}
              </ul>
            )}
            <div className="mt-4">
              {added ? (
                <div className="d-flex gap-2">
                  <Link className="btn btn-primary" to="/carrito">
                    Ir al carrito
                  </Link>
                  <Link className="btn btn-outline-primary" to="/checkout">
                    Finalizar compra
                  </Link>
                </div>
              ) : (
                <ItemCount stock={product.stock} initial={1} onAdd={handleAdd} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ItemDetail;
