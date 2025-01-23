import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPayment } from '../../services/ApiService';
import { useCart } from '../CartLogic/CartContext';

export const Payment = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart(); // Obtenemos los productos del carrito desde el contexto
  const [total, setTotal] = useState(0); // Estado para manejar el total del pedido

  // Efecto para cargar el total del pedido desde el localStorage
  useEffect(() => {
    const savedTotal = localStorage.getItem('totalPedido'); // Obtenemos el total del pedido
    if (savedTotal) {
      setTotal(parseFloat(savedTotal)); // Convertimos el total a número y lo guardamos en el estado
    } else {
      navigate('/cart'); // Si no hay total, redirigimos al carrito
    }
  }, [navigate]);

  // Función para manejar el pago con PayPal
  const handlePayPalPayment = async () => {
    try {
      // Llamamos al servicio para crear un pago en PayPal
      const approvalUrl = await createPayment(total);

      // Redirigimos al usuario al dominio de PayPal para completar el pago
      window.location.href = approvalUrl;
    } catch (error) {
      // Manejamos errores relacionados con el pago
      alert('Hubo un problema con el pago. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título de la página */}
      <h1 className="text-2xl font-bold mb-6">Pago con PayPal</h1>

      {/* Mostramos el total a pagar */}
      <p className="text-lg mb-4">Total a pagar: ${total.toFixed(2)}</p>

      {/* Botón para proceder al pago */}
      <button
        onClick={handlePayPalPayment}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Pagar con PayPal
      </button>
    </div>
  );
};
