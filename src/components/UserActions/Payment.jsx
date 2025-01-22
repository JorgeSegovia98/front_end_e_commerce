import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPayment } from '../../services/ApiService';
import { useCart } from '../CartLogic/CartContext';

export const Payment = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart(); // Usamos el carrito
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Recuperar el total del pedido desde el localStorage
    const savedTotal = localStorage.getItem('totalPedido');
    if (savedTotal) {
      setTotal(parseFloat(savedTotal));
    } else {
      navigate('/cart'); // Si no hay total, redirige al carrito
    }
  }, [navigate]);

  const handlePayPalPayment = async () => {
    try {
      // Crear el pago en PayPal
      const approvalUrl = await createPayment(total);

      // Redirigir al dominio de PayPal
      window.location.href = approvalUrl;
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Hubo un problema con el pago. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Pago con PayPal</h1>
      <p className="text-lg mb-4">Total a pagar: ${total.toFixed(2)}</p>
      <button
        onClick={handlePayPalPayment}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Pagar con PayPal
      </button>
    </div>
  );
};
