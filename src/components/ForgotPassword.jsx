import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Input } from "./Input";
import { Button } from "./Button";
import { changePassword } from "services/ApiService";
const API = 'https://backend-ecommerse-b6anfne4gqgacyc5.canadacentral-01.azurewebsites.net';


export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSecurityQuestionSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const response = await fetch(`${API}/data-api/usuarios?username=${encodeURIComponent(username)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Usuario no encontrado.');
      }
  
      const data = await response.json();
      // Find the user with the matching username
      const user = data._embedded.usuarios.find(u => u.username === username);
  
      if (!user) {
        throw new Error('Usuario no encontrado.');
      }
  
      console.log(user.preguntaSeguridad); // This should now work
  
      if (
        user.preguntaSeguridad &&
        user.preguntaSeguridad.trim() === securityAnswer.trim()
      ) {
        setStep(2);
      } else {
        setError('Respuesta de seguridad incorrecta.');
      }
    } catch (err) {
      setError(err.message || 'Ocurrió un error al buscar el usuario.');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    const changePasswordResponse = await changePassword(username, newPassword);

    if (changePasswordResponse) {
      alert('Contraseña actualizada exitosamente.');
    } else {
      alert('Hubo un problema al actualizar la contraseña.');
    }
    navigate('/');
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 fixed">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <Logo />
        <h1 className="text-2xl font-bold text-gray-800 text-center">Recuperar Contraseña</h1>

        {step === 1 && (
          <>
            <p className="text-gray-500 text-center">
              Ingresa tu nombre de usuario y responde a tu pregunta de seguridad.
            </p>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <form onSubmit={handleSecurityQuestionSubmit} className="space-y-4">
              <Input
                label="Nombre de usuario"
                type="text"
                name="username"
                placeholder="Tu nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Input
                label="Respuesta de Seguridad"
                type="text"
                name="securityAnswer"
                placeholder="Ingresa tu respuesta"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                required
              />
              <Button type="submit" text="Siguiente" />
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-gray-500 text-center">
              Ingresa tu nueva contraseña.
            </p>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <Input
                label="Nueva Contraseña"
                type="password"
                name="newPassword"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Input
                label="Confirmar Nueva Contraseña"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button type="submit" text="Guardar Contraseña" />
            </form>
          </>
        )}

        <div className="text-sm text-center text-gray-500 mt-4">
          ¿Recordaste tu contraseña?{' '}
          <Link to="/" className="text-indigo-600 hover:underline">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
