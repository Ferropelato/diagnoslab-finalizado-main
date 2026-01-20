## Guía Firebase (Auth + Firestore)

### 1) Crear proyecto en Firebase
1. Entrá a https://console.firebase.google.com/
2. Creá un proyecto nuevo.
3. En el panel de Firebase, agregá una **Web App**.

### 2) Configurar Authentication
1. En **Authentication > Sign-in method**, habilitá **Email/Password**.

### 3) Configurar Firestore
1. En **Firestore Database**, creá la base en modo de pruebas.
2. Creá una colección llamada `products`.
3. Creá una colección llamada `orders`.
4. (Opcional) Creá colección `users` para perfiles.

### 4) Variables de entorno (Vite)
Creá un archivo `.env` en la raíz del proyecto con:

```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### 5) Poblar productos (seed)
Hay un helper en `src/firebase/seedProducts.js`. Para usarlo:
1. Importalo temporalmente en `src/main.jsx`.
2. Ejecutá `seedProducts()` una sola vez.
3. Luego eliminá esa llamada para no duplicar datos.

Ejemplo rápido:

```js
import { seedProducts } from './firebase/seedProducts';
seedProducts();
```

### 6) Reglas básicas (desarrollo)
Para pruebas rápidas:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 7) Estructura de datos esperada
`products`
- title
- description
- price
- category
- tags
- meta (array)
- stock (number)
- imageKey (string)

`orders`
- buyer { uid, nombre, apellido, email, telefono }
- items [{ id, title, price, qty }]
- total
- createdAt
