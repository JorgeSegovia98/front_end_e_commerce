import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Input } from "./Input";
import { Button } from "./Button";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    
    // Find user by email
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);

    if (user) {
      setSecurityQuestion(user.securityQuestion);
      setStep(2);
    } else {
      alert("No se encontró un usuario con este correo electrónico");
    }
  };

  const handleSecurityQuestionSubmit = (e) => {
    e.preventDefault();
    
    // Find user by email
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);

    if (user && user.securityAnswer.toLowerCase() === securityAnswer.toLowerCase()) {
      setStep(3);
    } else {
      alert("Respuesta de seguridad incorrecta");
    }
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Update user's password
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      alert("Contraseña actualizada exitosamente");
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
              Ingresa tu correo electrónico para comenzar el proceso de recuperación
            </p>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <Input
                label="Correo electrónico"
                type="email"
                name="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" text="Siguiente" />
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-gray-500 text-center">
              Responde a tu pregunta de seguridad
            </p>
            <form onSubmit={handleSecurityQuestionSubmit} className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pregunta de Seguridad
                </label>
                <p className="text-lg font-semibold text-gray-800 text-center">
                  {securityQuestion}
                </p>
              </div>
              <Input
                label="Respuesta de Seguridad"
                type="text"
                name="securityAnswer"
                placeholder="Ingresa tu respuesta"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                required
              />
              <Button type="submit" text="Verificar" />
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-gray-500 text-center">
              Ingresa tu nueva contraseña
            </p>
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
              <Button type="submit" text="Restablecer Contraseña" />
            </form>
          </>
        )}

        <div className="text-sm text-center text-gray-500 mt-4">
          ¿Recordaste tu contraseña? {" "}
          <Link to="/" className="text-indigo-600 hover:underline">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}