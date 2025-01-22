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
      // Preparar los datos del pedido
      const pedido = {
        id_usuario: parseInt(userId, 10), // Convertir el ID del usuario a número
        productosIds: cartItems.map((item) => parseInt(item.id, 10)), // Convertir los IDs de los productos a números
      };

      // Llamar al backend para crear el pedido
      await createOrder(pedido);

      // Vaciar el carrito y notificar al usuario
      clearCart();
      alert("¡Pedido creado exitosamente!");

      // Redirigir a la página de pedidos
      navigate("/my-orders");
    } catch (error) {
      // Manejar errores durante la creación del pedido
      alert("Hubo un problema al crear el pedido. Por favor, intenta nuevamente.");
      navigate("/cart");
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
