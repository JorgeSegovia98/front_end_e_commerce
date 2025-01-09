import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../Logo";
import { Input } from "./Input";
import { Button } from "./Button";
import { login } from "services/ApiService";
import {setCookie} from "utils/Cookies"

export default function Home() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (username.includes('@')) {
      setError("El nombre de usuario no debe contener el carácter '@'.");
      return;
    }

    
    const success = await login(username, password);

    if (success) {
      setCookie('username', username);
      setError('');  
      navigate('/products-page');  
    } else {
      setError('Ha ocurrido un error al momento de iniciar sesión');  
    }
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 fixed">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <Logo />
        <h1 className="text-2xl font-bold text-gray-800 text-center">Bienvenido de nuevo</h1>
        <p className="text-gray-500 text-center">Ingresa a tu cuenta</p>
        <form className="space-y-4" onSubmit={handleLogin}>
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          <Input
            label="Nombre de usuario"
            type="text"
            name="username"
            placeholder="Tu nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="Contraseña"
            type="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-indigo-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Button type="submit" text="Iniciar Sesión" />
        </form>
        <div className="text-sm text-center text-gray-500">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}
