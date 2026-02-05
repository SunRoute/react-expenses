import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { loginWithEmail, loginWithGoogle } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import NavbarComponent from "../components/NavbarComponent";
import FooterComponent from "../components/FooterComponent";

//Componente de login
const LoginPage = () => {
  //Estados de la aplicación
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //Navegación entre rutas
  const navigate = useNavigate();
  //Función para iniciar sesión con correo electrónico
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Email y contraseña no pueden estar vacíos");
      return;
    }
    try {
      await loginWithEmail(email, password);
      toast.success("Conexión exitosa");
      navigate("/");
    } catch (error) {
      toast.error("Autenticación inválida");
    }
  };

  //Función para iniciar sesión con Google
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success("Conexión exitosa con Google");
      navigate("/");
    } catch (error) {
      toast.error("Error al iniciar sesión con Google");
    }
  };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <>
      <NavbarComponent />
      <div className="flex flex-col items-center justify-center h-130">
        <form className="flex flex-col gap-3 w-80" onSubmit={handleEmailLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded-md bg-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded-md bg-white"
          />
          <button
            type="submit"
            className="bg-blue-900 text-white p-2 rounded-md hover:bg-blue-950 transition"
          >
            Login
          </button>
        </form>
        <span className="my-4 text-sm text-blue-950">--- Or ---</span>
        <button
          onClick={handleGoogleLogin}
          className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition"
        >
          Login with Google
        </button>
      </div>
      {/* footer */}
      <div className="mt-auto text-center py-4">
        <FooterComponent appName="Project Creator" />
      </div>
    </>
  );
};

export default LoginPage;
