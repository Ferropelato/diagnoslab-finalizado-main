import React, { useState } from 'react';

const ItemCount = ({ stock = 0, initial = 1, onAdd }) => {
  const [count, setCount] = useState(Math.min(initial, stock));

  if (stock <= 0) {
    return <div className="text-danger fw-semibold">Producto sin stock</div>;
  }

  const handleDecrease = () => {
    setCount(prev => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setCount(prev => Math.min(stock, prev + 1));
  };

  const handleAdd = () => {
    if (typeof onAdd === 'function') {
      onAdd(count);
    }
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <div className="btn-group" role="group" aria-label="Selector de cantidad">
        <button className="btn btn-outline-primary" onClick={handleDecrease} type="button">
          -
        </button>
        <span className="btn btn-light">{count}</span>
        <button className="btn btn-outline-primary" onClick={handleIncrease} type="button">
          +
        </button>
      </div>
      <button className="btn btn-primary" onClick={handleAdd} type="button">
        Agregar al carrito
      </button>
      <small className="text-muted">Stock: {stock}</small>
    </div>
  );
};

export default ItemCount;
