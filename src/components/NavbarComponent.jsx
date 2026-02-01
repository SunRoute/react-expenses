import React, { useEffect, useState } from "react";
import LogoImg from "../assets/group-project.svg";
import { logout } from "../services/authService";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router";

//Componente para mostrar y gestionar el navbar
const NavbarComponent = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  //Obtener el usuario actual y actualizar la variable user cuando cambie
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  //Cerrar sesión
  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  return (
    <>
      <nav className="flex w-full justify-between items-center bg-blue-950 shadow-md py-2 px-4 md:py-3 md:px-10">
        {/* Logo */}
        <a href="/" className="shrink-0">
          <div className="flex gap-1 justify-center items-center cursor-pointer">
            <img
              src={LogoImg}
              alt="logo-image"
              className="h-10 w-10 md:h-14 md:w-14"
            />
            <p className="text-sm md:text-3xl pl-4 font-semibold text-stone-200 hover:text-stone-100 transition ease-in-out hidden sm:block">
              Project Creator
            </p>
          </div>
        </a>
        <div className="flex gap-6 justify-center items-center text-stone-200 font-semibold">
          {/* Mostrar imagen/nombre + botón de logout solo cuando el usuario está logueado */}
          {user ? (
            <div className="flex items-center gap-8">
              {user.photoURL ? (
                <img
                  src={user?.photoURL}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full text-white flex items-center justify-center font-semibold transition ease-in-out">
                  {user.displayName}
                  {/* {user.email.charAt(0).toUpperCase()} */}
                </div>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white text-sm py-2 px-4 rounded-md hover:bg-red-700 transition ease-in-out"
              >
                Logout
              </button>
            </div>
          ) : (
            <h1 className="text-lg text-stone-200 font-semibold">
              ¡Inicia sesión para comenzar!
            </h1>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavbarComponent;
