import React from 'react';

const CartWidget = ({ itemCount = 0 }) => {
  return (
    <div className="position-relative">
      <a className="nav-link" href="./pages/carrito.html">
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
      </a>
    </div>
  );
};

export default CartWidget;

