import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";

//Provider de Google
const googleProvider = new GoogleAuthProvider();

//Iniciar sesión con correo electrónico
export const loginWithEmail = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

//Iniciar sesión con Google
export const loginWithGoogle = async () => {
  return signInWithPopup(auth, googleProvider);
};

//Cerrar sesión
export const logout = async () => {
  return auth.signOut();
};

//Obtener el usuario actual
export const getCurrentUser = () => {
  return auth.currentUser;
};
