import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ARS } from '../utils/helpers';
import { getOrdersByUser } from '../firebase/firestoreService';

const Pedidos = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      const data = await getOrdersByUser(currentUser.uid, currentUser.email);
      setOrders(data);
    };

    fetchOrders();
  }, [currentUser]);

  const formatDate = (dateValue) => {
    if (!dateValue) return '-';
    if (dateValue?.toDate) {
      return dateValue.toDate().toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return new Date(dateValue).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pendiente: 'warning',
      procesando: 'info',
      completado: 'success',
      cancelado: 'danger'
    };
    return badges[status] || 'secondary';
  };

  const getStatusText = (status) => {
    const texts = {
      pendiente: 'Pendiente',
      procesando: 'En Proceso',
      completado: 'Completado',
      cancelado: 'Cancelado'
    };
    return texts[status] || status;
  };

  if (!currentUser) {
    return null;
  }

  if (orders.length === 0) {
    return (
      <>
        <header
          className="text-white text-center py-5"
          style={{
            background: 'linear-gradient(270deg, #4dabf7, #0d6efd, #004085)',
            backgroundSize: '600% 600%',
            animation: 'heroGradient 15s ease infinite'
          }}
        >
          <div className="container">
            <h1 className="display-6 fw-bold mb-2">Mis Pedidos</h1>
            <p className="mb-0">Historial de tus compras</p>
          </div>
        </header>

        <main className="py-5">
          <div className="container">
            <div className="text-center py-5">
              <i className="bi bi-bag-x" style={{ fontSize: '4rem', color: '#ccc', display: 'block', marginBottom: '1rem' }}></i>
              <h3 className="text-muted">No tienes pedidos aún</h3>
              <p className="text-muted">Cuando realices una compra, aparecerá aquí</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <header
        className="text-white text-center py-5"
        style={{
          background: 'linear-gradient(270deg, #4dabf7, #0d6efd, #004085)',
          backgroundSize: '600% 600%',
          animation: 'heroGradient 15s ease infinite'
        }}
      >
        <div className="container">
          <h1 className="display-6 fw-bold mb-2">Mis Pedidos</h1>
          <p className="mb-0">Historial de tus compras</p>
        </div>
      </header>

      <main className="py-5">
        <div className="container">
          <div className="row">
            {orders.map((order) => (
              <div key={order.id} className="col-12 mb-4">
                <div className="card shadow-sm border-0">
                  <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-0">Pedido #{order.id}</h5>
                      <small className="text-muted">{formatDate(order.createdAt || order.date)}</small>
                    </div>
                    <span className={`badge bg-${getStatusBadge(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-8">
                        <h6 className="mb-3">Productos:</h6>
                        <ul className="list-unstyled">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="mb-2 d-flex justify-content-between">
                              <span>
                                {item.title} × {item.qty}
                              </span>
                              <span>{ARS.format((item.price || 0) * (item.qty || 0))}</span>
                            </li>
                          ))}
                        </ul>
                        {order.notes && (
                          <div className="mt-3">
                            <small className="text-muted">
                              <strong>Notas:</strong> {order.notes}
                            </small>
                          </div>
                        )}
                      </div>
                      <div className="col-md-4 text-end">
                        <div className="mb-2">
                          <strong>Total:</strong>
                        </div>
                        <h4 className="text-primary">{ARS.format(order.total)}</h4>
                        <div className="mt-3">
                          <small className="text-muted">
                            <strong>Dirección de envío:</strong>
                            <br />
                            {order.shippingAddress}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Pedidos;

