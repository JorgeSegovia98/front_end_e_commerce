import React from 'react';

export const ProductCard = ({ product }) => {
  return (
    <div className="border rounded-lg shadow-lg p-4">
      <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
      <h2 className="text-xl font-bold mt-2">{product.title}</h2>
      <p className="text-gray-600">${product.price}</p>
      <p className="text-sm text-gray-500 mt-2">{product.description}</p>
    </div>
  );
};