import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { getUserProfile, saveUserProfile } from '../firebase/userService';
import { validationUtils } from '../utils/helpers';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const mapAuthError = (error) => {
    const code = error?.code;
    const map = {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-email': 'Email inválido',
      'auth/email-already-in-use': 'Ya existe un usuario con este email',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres'
    };
    return map[code] || error?.message || 'Error de autenticación';
  };

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      const profile = await getUserProfile(user.uid);
      setCurrentUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        ...(profile || {})
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const profile = await getUserProfile(result.user.uid);
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        ...(profile || {})
      };
      setCurrentUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: mapAuthError(error) };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  const register = async (userData) => {
    try {
      if (!validationUtils.email(userData.email)) {
        throw new Error('Email inválido');
      }

      if (!validationUtils.password(userData.pass)) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
      }

      if (userData.pass !== userData.pass2) {
        throw new Error('Las contraseñas no coinciden');
      }

      const result = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.pass
      );

      const displayName = `${userData.nombre} ${userData.apellido}`.trim();
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }

      const profile = {
        nombre: userData.nombre.trim(),
        apellido: userData.apellido.trim(),
        telefono: userData.telefono.trim(),
        direccion: userData.direccion?.trim() || ''
      };

      await saveUserProfile(result.user.uid, profile);

      const userSession = {
        uid: result.user.uid,
        email: result.user.email,
        displayName,
        ...profile
      };

      setCurrentUser(userSession);
      return { success: true, user: userSession };
    } catch (error) {
      return { success: false, error: mapAuthError(error) };
    }
  };

  const updateProfileData = async (profileData) => {
    try {
      if (!currentUser?.uid) {
        throw new Error('Usuario no autenticado');
      }

      const profile = {
        nombre: profileData.nombre.trim(),
        apellido: profileData.apellido.trim(),
        telefono: profileData.telefono.trim(),
        direccion: profileData.direccion?.trim() || ''
      };

      await saveUserProfile(currentUser.uid, profile);

      const updatedUser = {
        ...currentUser,
        ...profile
      };

      setCurrentUser(updatedUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: mapAuthError(error) };
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    register,
    updateProfile: updateProfileData,
    isLoggedIn: !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

