// Cart Component
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { createOrder } from '../../services/ApiService.js'; // Ruta corregida

export const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  const goToPayment = () => {
    const total = getCartTotal();
    localStorage.setItem('totalPedido', total);
    navigate('/payment');
  };


  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Tu carrito está vacío</h1>
        <button
          onClick={() => navigate('/products-page')}
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-center"
        >
          Seguir comprando
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tu carrito</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Lista de productos */}
        <div className="lg:w-2/3">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-6 mb-4">
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-gray-600">${item.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <select
                      className="border rounded p-1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen del pedido */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>
            <div className="space-y-2 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.title} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
            <button
              className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 text-center w-full"
              onClick={goToPayment}
            >
              Continuar al pago
            </button>
            <button
              onClick={() => navigate('/products-page')}
              className="mt-4 w-full bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 text-center"
            >
              Volver a la tienda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
