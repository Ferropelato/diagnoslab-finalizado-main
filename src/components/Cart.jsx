import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { ARS, uiUtils } from '../utils/helpers';
import CartItem from './CartItem';

const Cart = () => {
  const { cart, removeItem, updateItemQty, clearCart, getTotals } = useCart();
  const navigate = useNavigate();
  const { totalItems, totalAmount } = getTotals();

  const handleClear = async () => {
    if (!cart.length) return;
    const confirmed = await uiUtils.confirm('¿Vaciar carrito por completo?');
    if (confirmed) {
      clearCart();
      uiUtils.showToast('Carrito vaciado 🧹', 'info');
    }
  };

  if (cart.length === 0) {
    return (
      <main className="py-5">
        <div className="container text-center">
          <i className="bi bi-cart-x" style={{ fontSize: '4rem', color: '#ccc' }}></i>
          <h3 className="text-muted mt-3">Tu carrito está vacío</h3>
          <p className="text-muted">Agregá productos para comenzar tu pedido</p>
          <Link className="btn btn-primary mt-2" to="/productos">
            Ir al catálogo
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container my-5">
      <h1 className="mb-4">🛒 Mi Carrito</h1>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQty={updateItemQty}
                onRemove={removeItem}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center">
        <h4>Total items: <span>{totalItems}</span></h4>
        <h4>Total: <span>{ARS.format(totalAmount)}</span></h4>
      </div>

      <div className="mt-4 d-flex gap-2">
        <button className="btn btn-outline-danger" onClick={handleClear}>
          Vaciar carrito
        </button>
        <button className="btn btn-success ms-auto" onClick={() => navigate('/checkout')}>
          Finalizar compra
        </button>
      </div>
    </main>
  );
};

export default Cart;
