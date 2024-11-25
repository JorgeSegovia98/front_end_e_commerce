import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SellProduct = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      setImage(reader.result);
    };
    
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a new product object
    const newProduct = {
      id: Date.now(), // Use timestamp as a simple unique ID
      title: productName,
      price: parseFloat(price),
      description: description,
      image: image || "https://placehold.co/600x400", // Default image if none uploaded
      rating: 0 // Default rating
    };

    // Get existing products from localStorage
    const existingProducts = JSON.parse(localStorage.getItem('products')) || [];
    
    // Add new product
    const updatedProducts = [...existingProducts, newProduct];
    
    // Save to localStorage
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    // Navigate back to products page
    navigate('/products-page');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow mb-8">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 
            className="text-2xl font-bold text-blue-600 cursor-pointer"
            onClick={() => navigate('/products-page')}
          >
            Tienda Virtual
          </h1>
        </div>
      </nav>

      {/* Sell Product Form */}
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Vender Producto</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productName">
              Nombre del Producto
            </label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              Precio
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="4"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Imagen del Producto
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {image && (
              <img 
                src={image} 
                alt="Preview" 
                className="mt-4 w-full h-48 object-cover rounded-md"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Publicar Producto
          </button>
        </form>
      </div>
    </div>
  );
};