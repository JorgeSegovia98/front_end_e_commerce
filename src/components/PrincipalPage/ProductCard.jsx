import React from 'react';
import { useNavigate } from 'react-router-dom';

// Componente para mostrar una tarjeta de producto
// Props:
// - product: Objeto con los datos del producto (id, image, title, description, price, rating).
export const ProductCard = ({ product }) => {
  const navigate = useNavigate(); // Hook para navegar entre rutas.

  // Función para manejar el clic en el botón "Ver Detalles"
  const handleClick = () => {
    // Navegamos a la ruta del producto pasando sus datos a través del estado
    navigate(`/product/${product.id}`, {
      state: { product } // Pasamos el producto como estado para que esté disponible en la página de destino.
    });
  };

  return (
    <div className="border border-gray-300 rounded shadow-sm p-4 hover:shadow-md">
      {/* Imagen del producto o un placeholder si no tiene imagen */}
      <img
        src={product.image || 'https://placehold.co/600x400'}
        alt={product.title}
        className="w-full h-40 object-cover mb-4"
      />
      {/* Título del producto */}
      <h3 className="text-lg font-semibold">{product.title}</h3>
      {/* Descripción del producto */}
      <p className="text-sm text-gray-600">{product.description}</p>
      <div className="mt-2 flex justify-between items-center">
        {/* Precio del producto */}
        <span className="text-xl font-bold">${product.price}</span>
        {/* Calificación del producto */}
        <span className="text-yellow-500">★ {product.rating}</span>
      </div>
      {/* Botón para ver detalles del producto */}
      <button
        className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        onClick={handleClick}
      >
        Ver Detalles
      </button>
    </div>
  );
};
