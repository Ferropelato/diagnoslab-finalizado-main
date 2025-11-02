import React from 'react';

const ItemListContainer = ({ greeting = 'Bienvenido a nuestro catálogo de productos' }) => {
  return (
    <div className="container my-5">
      <div className="text-center">
        <h2 className="h3 mb-4">{greeting}</h2>
        <p className="lead text-muted">
          Explora nuestra amplia gama de productos para análisis clínicos
        </p>
      </div>
    </div>
  );
};

export default ItemListContainer;

