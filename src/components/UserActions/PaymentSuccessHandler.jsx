import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../services/ApiService';
import { useCart } from '../CartLogic/CartContext';
import { getUserIdFromToken } from 'utils/Auth';

export const PaymentSuccessHandler = () => {
  const userId = getUserIdFromToken(); // Extraer el ID del usuario desde el token
  const navigate = useNavigate();
  const { clearCart, cartItems } = useCart(); // Obtener funciones y datos del carrito

  useEffect(() => {
    // Obtener los parámetros de la URL
    const query = new URLSearchParams(window.location.search);
    const status = query.get('status');

    if (status === 'exito') {
      // Si el pago fue exitoso, procesar la orden
      handleSuccessPayment();
    } else {
      // Si el estado no es válido, redirigir al carrito
      navigate('/cart');
    }
  }, [navigate]);

  const handleSuccessPayment = async () => {
    // Crear el pedido en el backend
    const pedido = {
      id_usuario: userId, // Cambiar por el usuario autenticado
      productosIds: cartItems.map((item) => item.id),
    };

    const result = await createOrder(pedido);

    // Vaciar el carrito después de crear el pedido
    clearCart();

    // Verifica si el resultado es texto o un objeto JSON
    alert(result);

    // Redirigir a la página de pedidos
    navigate('/my-orders');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mensaje mientras se procesa el pago */}
      <h1 className="text-2xl font-bold mb-6">Procesando pago...</h1>
      <p>Por favor, espera mientras verificamos los detalles de tu pago.</p>
    </div>
  );
};
