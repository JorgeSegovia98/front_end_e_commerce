import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../services/ApiService';
import { useCart } from '../CartLogic/CartContext';
import { getUserIdFromToken } from 'utils/Auth';


export const PaymentSuccessHandler = () => {
  const userId = getUserIdFromToken
  
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
      // Crear el pedido en el backend
      const pedido = {
        id_usuario: userId, // Cambiar por el usuario autenticado
        productosIds: cartItems.map((item) => item.id),
      };

      console.log('Datos del pedido enviados al backend:', pedido);
      await createOrder(pedido);

      // Vaciar el carrito después de crear el pedido
      clearCart();

      // Redirigir a la página de pedidos
      alert('¡Pedido creado exitosamente!');
      navigate('/MyOrdersPage');
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      alert('Hubo un problema al crear el pedido. Por favor, intenta nuevamente.');
      navigate('/cart');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Procesando pago...</h1>
      <p>Por favor, espera mientras verificamos los detalles de tu pago.</p>
    </div>
  );
};
