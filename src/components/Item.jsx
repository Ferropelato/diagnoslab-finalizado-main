import React from 'react';
import { Link } from 'react-router-dom';
import { ARS } from '../utils/helpers';
import { resolveProductImage } from '../utils/productImages';

const Item = ({ product }) => {
  return (
    <article className="prod-card">
      <img src={resolveProductImage(product)} alt={product.title} />
      <div className="prod-content">
        <h3>{product.title}</h3>
        <p>{product.description}</p>
        {product.meta?.length > 0 && (
          <ul className="prod-meta">
            {product.meta.map((meta, index) => (
              <li key={`${product.id}-meta-${index}`}>{meta}</li>
            ))}
          </ul>
        )}
        <div className="d-flex align-items-center justify-content-between mt-2">
          <strong className="text-primary">{ARS.format(product.price)}</strong>
          <Link className="btn btn-outline-primary btn-sm" to={`/item/${product.id}`}>
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
};

export default Item;
