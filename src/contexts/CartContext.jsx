import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageUtils } from '../utils/helpers';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const cartKey = 'dlab_cart';
  const MAX_QTY_PER_ITEM = 99;

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    storageUtils.set(cartKey, cart);
  }, [cart]);

  const loadCart = () => {
    const savedCart = storageUtils.get(cartKey, []);
    if (Array.isArray(savedCart)) {
      setCart(savedCart);
    }
  };

  const addItem = (item, qty = 1) => {
    try {
      const addQty = Math.max(1, parseInt(qty, 10) || 1);
      if (!item || !item.id) {
        throw new Error('Producto sin ID válido');
      }
      if (typeof item.stock === 'number' && item.stock <= 0) {
        throw new Error('Producto sin stock');
      }

      setCart(prevCart => {
        const existingIndex = prevCart.findIndex(p => p.id === item.id);
        let updatedCart;
        const stockLimit = typeof item.stock === 'number' ? item.stock : MAX_QTY_PER_ITEM;
        
        if (existingIndex >= 0) {
          const newQty = (prevCart[existingIndex].qty || 0) + addQty;
          const cappedQty = Math.min(newQty, stockLimit, MAX_QTY_PER_ITEM);
          if (cappedQty !== newQty) {
            updatedCart = [...prevCart];
            updatedCart[existingIndex].qty = cappedQty;
          } else {
            updatedCart = [...prevCart];
            updatedCart[existingIndex].qty = newQty;
          }
        } else {
          updatedCart = [
            ...prevCart,
            { ...item, qty: Math.min(addQty, stockLimit, MAX_QTY_PER_ITEM) }
          ];
        }

        // Guardar en localStorage
        storageUtils.set(cartKey, updatedCart);
        return updatedCart;
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const removeItem = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateItemQty = (id, qty) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id 
          ? {
              ...item,
              qty: Math.min(
                Math.max(1, parseInt(qty, 10) || 1),
                typeof item.stock === 'number' ? item.stock : MAX_QTY_PER_ITEM,
                MAX_QTY_PER_ITEM
              )
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    storageUtils.set(cartKey, []);
  };

  const getTotals = () => {
    const totalItems = cart.reduce((acc, item) => acc + (item.qty || 0), 0);
    const totalAmount = cart.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 0), 0);
    return { totalItems, totalAmount };
  };

  const value = {
    cart,
    addItem,
    removeItem,
    updateItemQty,
    clearCart,
    getTotals
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

