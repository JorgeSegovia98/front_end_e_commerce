import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link to={`/product/${product.id}`}>
        <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-medium mb-2">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="text-gray-700 mb-2">{product.price}</p>
        <Link
          to={`/product/${product.id}`}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:outline-none"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;