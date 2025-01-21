import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPayment, createOrder } from '../../services/ApiService';

export const Payment = () => {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const savedTotal = localStorage.getItem('totalPedido');
    if (savedTotal) {
      setTotal(parseFloat(savedTotal));
    } else {
      navigate('/cart'); // Redirige al carrito si no hay total
    }
  }, [navigate]);

  const handlePayPalPayment = async () => {
    try {
      // Crear el pago en PayPal
      const approvalUrl = await createPayment(total);

      // Redirigir al usuario a PayPal
      window.location.href = approvalUrl;
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Hubo un problema con el pago. Por favor, intenta nuevamente.');
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const paymentStatus = query.get('state');
    const payerId = query.get('payerID');
    const paymentId = query.get('paymentId');

    if (paymentStatus === 'approved' && payerId && paymentId) {
      const createOrderAfterPayment = async () => {
        try {
          const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
          const productosIds = cartItems.map(item => item.id);

          // Crear la orden después del pago
          await createOrder({
            id_usuario: 1, // Cambia esto por el ID real del usuario si es necesario
            productosIds,
          });

          // Limpiar el carrito
          localStorage.removeItem('cartItems');
          localStorage.removeItem('totalPedido');

          alert('Pago exitoso y pedido creado');
          navigate('/orders'); // Redirige al historial de pedidos
        } catch (error) {
          console.error('Error al crear el pedido:', error);
          alert('Hubo un problema al crear tu pedido. Por favor, contacta soporte.');
        }
      };

      createOrderAfterPayment();
    }
  }, [navigate]);

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
