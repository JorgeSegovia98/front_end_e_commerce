// src/components/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { useCart } from './CartContext';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    // Logica API
    const mockProduct = {
      id: parseInt(id),
      title: `Producto ${id}`,
      price: 99.99,
      description: `Descripción detallada del producto ${id}...`,
      image: "/api/placeholder/800/600",
      rating: 5
    };
    
    setProduct(mockProduct);
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    navigate('/cart');
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <img 
            src={product.image}
            alt={product.title}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        
        <div className="w-full md:w-1/3 space-y-4">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {'★'.repeat(product.rating)}
            </div>
            <span className="text-gray-600">({product.rating} reviews)</span>
          </div>
          <p className="text-2xl font-bold text-indigo-600">${product.price}</p>
          <p className="text-gray-600">{product.description}</p>
          
          <div className="flex gap-4">
            <Button 
              type="button" 
              text="Añadir al carrito" 
              onClick={handleAddToCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};