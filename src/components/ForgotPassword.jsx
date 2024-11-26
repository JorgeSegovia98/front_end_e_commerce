import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Input } from "./Input";
import { Button } from "./Button";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSecurityQuestionSubmit = (e) => {
    e.preventDefault();

    // Find user by username
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username);

    if (user && user.securityAnswer.toLowerCase() === securityAnswer.toLowerCase()) {
      setStep(2);
    } else {
      setError('Respuesta de seguridad incorrecta.');
    }
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    // Update user's password
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.username === username);

    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      alert('Contraseña actualizada exitosamente.');
      navigate('/');
    }
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
          ¿Recordaste tu contraseña?{" "}
          <Link to="/" className="text-indigo-600 hover:underline">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
