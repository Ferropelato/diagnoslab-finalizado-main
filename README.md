# DiagnosLab - SPA e-commerce

Front-end SPA desarrollado con React + React Router. Incluye catálogo dinámico desde Firestore, detalle de producto, carrito con contexto, checkout y autenticación con Firebase.

## Funcionalidades principales
- Catálogo con filtros por categoría y búsqueda.
- Detalle de producto con selección de cantidad.
- Carrito con persistencia, totales y eliminación de ítems.
- Checkout con generación de orden en Firestore.
- Autenticación con Firebase (registro e inicio de sesión).
- Perfil de usuario editable.

## Tecnologías
- React + Vite
- React Router
- Firebase Auth + Firestore
- Bootstrap + SASS
- Toastify + SweetAlert2

## Estructura recomendada (implementada)
- App
  - NavBar
  - CartWidget
  - ItemListContainer → ItemList → Item
  - ItemDetailContainer → ItemDetail → ItemCount
  - Cart → CartItem
  - CheckoutForm

## Instalación
```bash
npm install
npm run dev
```

## Firebase
Seguí la guía en `docs/firebase-setup.md` para:
- Configurar variables de entorno
- Habilitar Authentication
- Crear colecciones en Firestore
- Cargar productos de ejemplo

## Scripts
- `npm run dev` inicia el servidor de desarrollo
- `npm run build` genera el build de producción
- `npm run preview` sirve el build localmente
