import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createProduct, updateProduct, uploadProductImage } from '../services/ApiService';

export const SellProduct = () => {
  const location = useLocation();
  const editingProduct = location.state?.product;
  
  const [productName, setProductName] = useState(editingProduct?.title || '');
  const [price, setPrice] = useState(editingProduct?.price || '');
  const [description, setDescription] = useState(editingProduct?.description || '');
  const [image, setImage] = useState(editingProduct?.image || null);
  const [error, setError] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        nombre: productName,
        precio: parseFloat(price),
        descripcion: description,
        imagen: null,
        usuario: { id_usuario: 1 }, // Adjust based on authentication context
      };

      let savedProduct;
      if (editingProduct) {
        savedProduct = await updateProduct(editingProduct.id, productData);
      } else {
        savedProduct = await createProduct(productData);
      }

      if (image && (!editingProduct || image !== editingProduct.image)) {
        const response = await fetch(image);
        const blob = await response.blob();
        const imageFile = new File([blob], 'product-image.jpg', { 
          type: blob.type || 'image/jpeg' 
        });

        await uploadProductImage(savedProduct.id, imageFile);
      }

      navigate('/my-products');
    } catch (error) {
      setError('Hubo un error al publicar/actualizar el producto. Intenta de nuevo.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
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

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {editingProduct ? 'Editar Producto' : 'Vender Producto'}
          </h2>

          {error && (
            <div className="text-red-500 text-center mb-4">
              {error}
            </div>
          )}

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
            {editingProduct ? 'Actualizar Producto' : 'Publicar Producto'}
          </button>
        </form>
      </div>
    </div>
  );
};