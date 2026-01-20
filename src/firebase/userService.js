import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const usersCollection = 'users';

export const saveUserProfile = async (uid, profile) => {
  const ref = doc(db, usersCollection, uid);
  await setDoc(ref, profile, { merge: true });
};

export const getUserProfile = async (uid) => {
  const ref = doc(db, usersCollection, uid);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return snapshot.data();
};
