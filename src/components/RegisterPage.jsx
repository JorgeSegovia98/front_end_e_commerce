import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Input } from "./Input";
import { Button } from "./Button";

export default function RegisterPage() {
  return (
    <div className="flex w-screen h-screen items-center justify-center bg-gradient-to-r from-green-400 via-teal-500 to-blue-600 fixed">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <Logo />
        <h1 className="text-2xl font-bold text-gray-800 text-center">Crea una cuenta</h1>
        <p className="text-gray-500 text-center">¡Únete y explora nuestros productos!</p>
        <form className="space-y-4">
          <Input
            label="Nombre completo"
            type="text"
            name="fullname"
            placeholder="Ingresa tu nombre"
          />
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
          <Input
            label="Confirmar contraseña"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
          />
          <Button type="submit" text="Registrarse" />
        </form>
        <div className="text-sm text-center text-gray-500">
          ¿Ya tienes una cuenta? {" "}
          <Link to="/" className="text-teal-600 hover:underline">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}