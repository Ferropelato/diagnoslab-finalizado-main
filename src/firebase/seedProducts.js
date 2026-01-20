import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { productsSeed } from '../data/productsSeed';

export const seedProducts = async () => {
  const productsCollection = collection(db, 'products');
  const created = [];

  for (const product of productsSeed) {
    const docRef = await addDoc(productsCollection, product);
    created.push(docRef.id);
  }

  return created;
};
