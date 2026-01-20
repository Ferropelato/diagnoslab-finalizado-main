import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { createOrder } from '../firebase/firestoreService';
import { ARS, uiUtils, validationUtils } from '../utils/helpers';

const CheckoutForm = () => {
  const { currentUser } = useAuth();
  const { cart, clearCart, getTotals } = useCart();
  const navigate = useNavigate();
  const { totalAmount } = getTotals();
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: currentUser?.nombre || '',
    apellido: currentUser?.apellido || '',
    email: currentUser?.email || '',
    telefono: currentUser?.telefono || ''
  });

  if (cart.length === 0) {
    return (
      <main className="py-5">
        <div className="container text-center">
          <h2 className="mb-3">No hay productos en el carrito</h2>
          <button className="btn btn-primary" onClick={() => navigate('/productos')}>
            Volver al catálogo
          </button>
        </div>
      </main>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.nombre.trim()) return 'El nombre es obligatorio';
    if (!formData.apellido.trim()) return 'El apellido es obligatorio';
    if (!validationUtils.email(formData.email)) return 'Email inválido';
    if (!validationUtils.phone(formData.telefono)) return 'Teléfono inválido';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      uiUtils.showToast(validationError, 'warning');
      return;
    }

    try {
      setLoading(true);
      const order = {
        buyer: {
          uid: currentUser?.uid || null,
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          telefono: formData.telefono
        },
        items: cart.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          qty: item.qty
        })),
        status: 'pendiente',
        total: totalAmount
      };

      const id = await createOrder(order);
      setOrderId(id);
      clearCart();
      uiUtils.showToast('Compra finalizada ✅', 'success');
    } catch (err) {
      uiUtils.showToast('No se pudo finalizar la compra', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container my-5">
      <h1 className="mb-4">Checkout</h1>

      {orderId ? (
        <div className="alert alert-success">
          <h4>¡Gracias por tu compra!</h4>
          <p className="mb-0">Tu orden fue generada con el ID:</p>
          <strong>{orderId}</strong>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nombre</label>
            <input
              className="form-control"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Apellido</label>
            <input
              className="form-control"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Teléfono</label>
            <input
              className="form-control"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-semibold">Total</span>
              <span className="fw-bold">{ARS.format(totalAmount)}</span>
            </div>
          </div>
          <div className="col-12">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Procesando...' : 'Confirmar compra'}
            </button>
          </div>
        </form>
      )}
    </main>
  );
};

export default CheckoutForm;
