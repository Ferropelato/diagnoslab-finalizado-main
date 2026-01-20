import React from 'react';
import { ARS } from '../utils/helpers';

const CartItem = ({ item, onUpdateQty, onRemove }) => {
  const handleQtyChange = (e) => {
    onUpdateQty(item.id, e.target.value);
  };

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center gap-2">
          <img
            src={item.image || item.img}
            alt={item.title}
            style={{ width: 56, height: 56, objectFit: 'contain' }}
          />
          <div>
            <div className="fw-semibold">{item.title}</div>
            <small className="text-muted">{ARS.format(item.price)}</small>
          </div>
        </div>
      </td>
      <td style={{ maxWidth: 120 }}>
        <input
          className="form-control form-control-sm"
          type="number"
          min="1"
          max={item.stock || 99}
          value={item.qty}
          onChange={handleQtyChange}
        />
      </td>
      <td>{ARS.format(item.price)}</td>
      <td>{ARS.format(item.price * item.qty)}</td>
      <td className="text-end">
        <button className="btn btn-sm btn-outline-danger" onClick={() => onRemove(item.id)}>
          <i className="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
