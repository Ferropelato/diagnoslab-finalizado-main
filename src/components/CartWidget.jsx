import React from 'react';
import { Link } from 'react-router-dom';

const CartWidget = ({ itemCount = 0 }) => {
  return (
    <div className="position-relative">
      <Link className="nav-link" to="/carrito">
        🛒
        {itemCount > 0 && (
          <span
            className="badge bg-danger position-absolute translate-middle p-1"
            style={{
              top: 0,
              right: 0,
              fontSize: '0.7rem',
              display: 'inline-block'
            }}
          >
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </Link>
    </div>
  );
};

export default CartWidget;

