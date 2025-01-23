import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

export const CartIcon = () => {
  const navigate = useNavigate();

  // Accedemos al número de productos en el carrito
  const { getCartCount } = useCart();
  const count = getCartCount();  // Obtener la cantidad de artículos en el carrito

  return (
    <div
      className="fixed top-4 right-4 cursor-pointer flex items-center"
      onClick={() => navigate('/cart')} // Redirige al carrito cuando se hace clic en el ícono
    >
      <div className="relative">
        {/* Icono SVG del carrito */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-indigo-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {/* Si hay productos en el carrito, mostramos un contador sobre el ícono */}
        {count > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {count} {/* Muestra la cantidad de productos en el carrito */}
          </div>
        )}
      </div>
    </div>
  );
};
