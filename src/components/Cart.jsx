import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { Button } from './Button';

export const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  const goToPayment = () => {
    navigate('/payment');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Tu carrito está vacío</h1>
        <Button 
          type="button" 
          text="Seguir comprando" 
          onClick={() => navigate('/products-page')}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tu carrito</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
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
                      onChange={(e) => updateQuantity(item.id, e.target.value)}
                    >
                      {[1,2,3,4,5].map(num => (
                        <option key={num} value={num}>{num}</option>
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

        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
            <Button 
              type="button" 
              text="Continuar al pago" 
              onClick={goToPayment}
            />
          </div>
        </div>
      </div>
    </div>
  );
};