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

  // Función para manejar un pago exitoso
  const handleSuccessPayment = async () => {
    try {
      // Crear el pedido en el backend
      const pedido = {
        id_usuario: userId, // Cambiar por el usuario autenticado
        productosIds: cartItems.map((item) => item.id),
      };

      console.log('Datos del pedido enviados al backend:', pedido);

      const response = await createOrder(pedido);

      // Verificar si la respuesta del backend fue exitosa
      if (response && response.id) {
        console.log('Pedido creado exitosamente:', response);
        // Vaciar el carrito después de crear el pedido
        clearCart();

        // Redirigir a la página de pedidos
        alert('¡Pedido creado exitosamente!');
        navigate('/my-orders');
      } else {
        throw new Error('Respuesta inesperada del backend al crear el pedido');
      }
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      alert('Hubo un problema al crear el pedido. Por favor, intenta nuevamente.');
      navigate('/cart');
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mensaje mientras se procesa el pago */}
      <h1 className="text-2xl font-bold mb-6">Procesando pago...</h1>
      <p>Por favor, espera mientras verificamos los detalles de tu pago.</p>
    </div>
  );
};
