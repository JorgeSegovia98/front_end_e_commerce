import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Input } from "./Input";
import { Button } from "./Button";

export default function ForgotPassword() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <Logo />
        <h1 className="text-2xl font-bold text-gray-800 text-center">Recuperar Contraseña</h1>
        <p className="text-gray-500 text-center">
          Ingresa tu correo electrónico y te enviaremos las instrucciones para recuperar tu contraseña
        </p>
        <form className="space-y-4">
          <Input
            label="Correo electrónico"
            type="email"
            name="email"
            placeholder="ejemplo@correo.com"
          />
          <Button type="submit" text="Enviar Instrucciones" />
        </form>
        <div className="text-sm text-center text-gray-500">
          ¿Recordaste tu contraseña? {" "}
          <Link to="/" className="text-indigo-600 hover:underline">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}