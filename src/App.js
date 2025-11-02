import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ItemListContainer from './components/ItemListContainer';

const App = () => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Función para actualizar el conteo del carrito
    const updateCartCount = () => {
      if (window.cartManager) {
        const { totalItems } = window.cartManager.getTotals();
        setCartCount(totalItems);
      } else if (window.cart && Array.isArray(window.cart)) {
        const total = window.cart.reduce((acc, item) => acc + (item.qty || 0), 0);
        setCartCount(total);
      }
    };

    // Actualizar al cargar
    updateCartCount();

    // Escuchar cambios en el carrito (si existe el evento personalizado)
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Polling como fallback
    const interval = setInterval(updateCartCount, 1000);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <Navbar 
        welcomeMessage="¡Bienvenido a DiagnosLab! Tu laboratorio de confianza"
        cartCount={cartCount}
      />
      <main>
        <ItemListContainer greeting="Explora nuestros productos de laboratorio" />
      </main>
    </div>
  );
};

export default App;

