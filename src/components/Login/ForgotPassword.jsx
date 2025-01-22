import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Logo } from "../Logo";
import { Input } from "./Input";
import { Button } from "./Button";
import { changePassword } from "services/ApiService";
import DOMPurify from "dompurify";

export default function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const navigate = useNavigate();

  // Función para manejar el restablecimiento de la contraseña
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");

    // Verificar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Validar la nueva contraseña utilizando una expresión regular para asegurar que cumpla con los criterios de seguridad
    if (!passwordRegex.test(newPassword)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial."
      );
      return;
    }

    try {
      // Se utiliza DOMPurify para limpiar cualquier entrada y prevenir ataques de Cross-Site Scripting (XSS)
      const sanitizedNewPassword = DOMPurify.sanitize(newPassword);
      const sanitizedSecurityAnswer = DOMPurify.sanitize(securityAnswer);

      // Enviar la solicitud para cambiar la contraseña utilizando los datos sanitizados
      const changePasswordResponse = await changePassword(
        username, // Nombre de usuario
        sanitizedNewPassword, // Contraseña nueva
        sanitizedSecurityAnswer // Respuesta de seguridad
      );

      if (changePasswordResponse) {
        // Si el cambio de contraseña es exitoso, se informa al usuario y se redirige a la página de inicio de sesión
        alert("Contraseña actualizada exitosamente.");
        navigate("/"); // Redirige al inicio de sesión
      } else {
        // Si la respuesta del servidor es negativa (credenciales incorrectas), se muestra un error
        setError("Credenciales incorrectas. Intenta nuevamente.");
      }
    } catch (error) {
      // En caso de error inesperado, se captura y se muestra un mensaje genérico
      setError("Error inesperado al cambiar la contraseña.");
      // Eliminamos los console.log que pueden exponer detalles sensibles
      // console.error("Error en handlePasswordReset:", error); // Comentado para producción
    }
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 fixed">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <Logo />
        <h1 className="text-2xl font-bold text-gray-800 text-center">Recuperar Contraseña</h1>
        <p className="text-gray-500 text-center">
          Ingresa tu nombre de usuario, la respuesta a tu pregunta de seguridad y tu nueva contraseña.
        </p>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <Input
            label="Nombre de usuario"
            type="text"
            name="username"
            placeholder="Tu nombre de usuario"
            value={username}
            onChange={(e) => setUsername(DOMPurify.sanitize(e.target.value))} // Sanitización de la entrada
            required
          />
          <Input
            label="Respuesta de Seguridad"
            type="text"
            name="securityAnswer"
            placeholder="Ingresa tu respuesta"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(DOMPurify.sanitize(e.target.value))} // Sanitización de la entrada
            required
          />
          <Input
            label="Nueva Contraseña"
            type="password"
            name="newPassword"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(DOMPurify.sanitize(e.target.value))} // Sanitización de la entrada
            required
          />
          <Input
            label="Confirmar Nueva Contraseña"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(DOMPurify.sanitize(e.target.value))} // Sanitización de la entrada
            required
          />
          <Button type="submit" text="Guardar Contraseña" />
        </form>

        <div className="text-sm text-center text-gray-500 mt-4">
          ¿Recordaste tu contraseña?{" "}
          <Link to="/" className="text-indigo-600 hover:underline">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
