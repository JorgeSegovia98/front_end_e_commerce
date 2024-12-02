import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Enviar los datos del producto usando el estado en el navigate
    navigate(`/product/${product.id}`, {
      state: { product }  // Aquí pasamos los datos del producto
    });
  };

  return (
    <div className="border border-gray-300 rounded shadow-sm p-4 hover:shadow-md">
      <img src={product.image || 'https://placehold.co/600x400'} alt={product.title} className="w-full h-40 object-cover mb-4" />
      <h3 className="text-lg font-semibold">{product.title}</h3>
      <p className="text-sm text-gray-600">{product.description}</p>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-xl font-bold">${product.price}</span>
        <span className="text-yellow-500">★ {product.rating}</span>
      </div>
      <button className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600" onClick={handleClick}>
        Ver Detalles
      </button>
    </div>
  );
};
