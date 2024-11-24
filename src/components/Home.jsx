import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Input } from "./Input";
import { Button } from "./Button";

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <Logo />
        <h1 className="text-2xl font-bold text-gray-800 text-center">Bienvenido de nuevo</h1>
        <p className="text-gray-500 text-center">Ingresa a tu cuenta</p>
        <form className="space-y-4">
          <Input
            label="Correo electrónico"
            type="email"
            name="email"
            placeholder="ejemplo@correo.com"
          />
          <Input
            label="Contraseña"
            type="password"
            name="password"
            placeholder="••••••••"
          />
          <Button type="submit" text="Iniciar Sesión" />
        </form>
        <div className="text-sm text-center text-gray-500">
          ¿No tienes una cuenta? {" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}