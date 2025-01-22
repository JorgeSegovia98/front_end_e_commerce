import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../services/ApiService';
import { useCart } from '../CartLogic/CartContext';
import { getUserIdFromToken } from 'utils/Auth';


export const PaymentSuccessHandler = () => {
  const userId = getUserIdFromToken(); // ID del usuario extraído del token

  const navigate = useNavigate();
  const { clearCart, cartItems } = useCart(); // Obtener carrito

  useEffect(() => {
    console.log('Ejecutando PaymentSuccessHandler...');
    const query = new URLSearchParams(window.location.search);
    const status = query.get('status');
    console.log('Parámetro status:', status);

    if (status === 'exito') {
      console.log('Procesando el pago...');
      handleSuccessPayment();
    } else {
      console.log('Estado no válido, redirigiendo al carrito...');
      navigate('/cart');
    }
  }, [navigate]);


  const handleSuccessPayment = async () => {
    try {
      // Asegúrate de que los datos están en el formato correcto
      const pedido = {
        id_usuario: parseInt(userId, 10), // Convertir a número explícitamente
        productosIds: cartItems.map((item) => parseInt(item.id, 10)), // Convertir los IDs a números
      };

      console.log("Datos enviados al backend para crear el pedido:", pedido);

      const response = await createOrder(pedido); // Llamada al backend para crear el pedido
      console.log("Respuesta del backend al crear el pedido:", response);

      clearCart(); // Vaciar el carrito después de crear el pedido
      alert("¡Pedido creado exitosamente!");
      navigate("/my-orders"); // Redirigir a la página de pedidos
    } catch (error) {
      console.error("Error al crear el pedido:", error);
      alert("Hubo un problema al crear el pedido. Por favor, intenta nuevamente.");
      navigate("/cart");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Procesando pago...</h1>
      <p>Por favor, espera mientras verificamos los detalles de tu pago.</p>
    </div>
  );
};
