import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Input } from "./Input";
import { Button } from "./Button";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    address: '',
    phone: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: ''
  });

  const navigate = useNavigate();

  const securityQuestions = [
    "¿Cuál es tu fruta favorita?",
    "¿Cual es el nombre de tu primer mascota?", 
    "¿Cual es el nombre de tu pokemon favorito?"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Create user object to store
    const userToStore = {
      username: formData.username,
      email: formData.email,
      address: formData.address,
      phone: formData.phone,
      password: formData.password,
      securityQuestion: formData.securityQuestion,
      securityAnswer: formData.securityAnswer
    };

    // Get existing users or initialize empty array
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    const userExists = existingUsers.some(user => user.email === formData.email);
    
    if (userExists) {
      alert("Este correo electrónico ya está registrado");
      return;
    }

    // Add new user
    existingUsers.push(userToStore);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    // Navigate to login or home page
    navigate('/');
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-gradient-to-r from-green-400 via-teal-500 to-blue-600 fixed">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <Logo />
        <h1 className="text-2xl font-bold text-gray-800 text-center">Crea una cuenta</h1>
        <p className="text-gray-500 text-center">¡Únete y explora nuestros productos!</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <Input
                label="Nombre de usuario"
                type="text"
                name="username"
                placeholder="Ingresa tu nombre de usuario"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Correo electrónico"
                type="email"
                name="email"
                placeholder="ejemplo@correo.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Dirección"
                type="text"
                name="address"
                placeholder="Ingresa tu dirección"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-4">
              <Input
                label="Teléfono"
                type="tel"
                name="phone"
                placeholder="Ingresa tu número de teléfono"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Contraseña"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Confirmar contraseña"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Security Question Section */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pregunta de Seguridad
              </label>
              <select
                name="securityQuestion"
                value={formData.securityQuestion}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona una pregunta</option>
                {securityQuestions.map((question, index) => (
                  <option key={index} value={question}>
                    {question}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Input
                label="Respuesta de Seguridad"
                type="text"
                name="securityAnswer"
                placeholder="Ingresa tu respuesta"
                value={formData.securityAnswer}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" text="Registrarse" className="w-full" />
          </div>
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