import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { uiUtils, ARS } from '../utils/helpers';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(product.min || 1);

  const handleAddToCart = () => {
    const qty = Math.max(product.min || 1, parseInt(quantity, 10) || 1);
    const step = product.step || 1;
    const max = product.max || 999;

    // Ajustar cantidad según step
    let adjustedQty = qty;
    if (step > 1) {
      adjustedQty = Math.ceil(qty / step) * step;
    }

    // Limitar a [min, max]
    adjustedQty = Math.min(Math.max(adjustedQty, product.min || 1), max);

    if (adjustedQty !== qty) {
      setQuantity(adjustedQty);
      uiUtils.showToast(
        `Cantidad ajustada a ${adjustedQty} (mín. ${product.min || 1}, máx. ${max}, paso ${step})`,
        'warning'
      );
    }

    const result = addItem(product, adjustedQty);
    if (result.success) {
      uiUtils.showToast('Producto agregado al carrito ✅', 'success');
    } else {
      uiUtils.showToast(result.error || 'Error al agregar producto', 'error');
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10) || product.min || 1;
    setQuantity(value);
  };

  return (
    <article className="prod-card" data-id={product.id} data-price={product.price}>
      <img src={product.image} alt={product.title} />
      <div className="prod-content">
        <h3>{product.title}</h3>
        <p>{product.description}</p>
        {product.meta && product.meta.length > 0 && (
          <ul className="prod-meta">
            {product.meta.map((meta, index) => (
              <li key={index}>{meta}</li>
            ))}
          </ul>
        )}
        <div className="prod-actions d-flex gap-2 align-items-center">
          <div className="input-group input-group-sm" style={{ maxWidth: '190px' }}>
            <span className="input-group-text">Cantidad</span>
            <input
              type="number"
              className="form-control qty-input"
              min={product.min || 1}
              step={product.step || 1}
              max={product.max || 999}
              value={quantity}
              onChange={handleQuantityChange}
            />
          </div>
          <button type="button" className="btn btn-primary btn-sm btn-add" onClick={handleAddToCart}>
            Agregar
          </button>
        </div>
        <div className="mt-2">
          <strong className="text-primary">{ARS.format(product.price)}</strong>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;

