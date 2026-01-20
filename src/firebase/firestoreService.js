import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const productsCollection = collection(db, 'products');
const ordersCollection = collection(db, 'orders');

export const getProducts = async () => {
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
};

export const getProductsByCategory = async (categoryId) => {
  const q = query(productsCollection, where('category', '==', categoryId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
};

export const getProductById = async (productId) => {
  const ref = doc(db, 'products', productId);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
};

export const createOrder = async (order) => {
  const orderPayload = {
    ...order,
    createdAt: serverTimestamp()
  };
  const docRef = await addDoc(ordersCollection, orderPayload);
  return docRef.id;
};

export const getOrdersByUser = async (uid, email) => {
  if (!uid && !email) return [];
  const q = query(
    ordersCollection,
    where(uid ? 'buyer.uid' : 'buyer.email', '==', uid || email)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
};
