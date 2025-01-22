import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProductWithImage, createProduct, uploadImage } from 'services/ApiService';
import { getUserIdFromToken } from 'utils/Auth';
import DOMPurify from 'dompurify';

export const SellProduct = () => {
  // Función para decodificar el JWT manualmente
  const userId = getUserIdFromToken(); // ID del usuario extraído del token

  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null); // Imagen seleccionada
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Manejo del cambio de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Guarda la imagen seleccionada
    }
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const sanitizedProductName = DOMPurify.sanitize(productName);
    const sanitizedDescription = DOMPurify.sanitize(description);

    const productData = {
      nombre: sanitizedProductName,
      precio: parseFloat(price),
      descripcion: sanitizedDescription,
      usuario: { id: userId }, // ID extraído del token
    };

    try {
      // Paso 1: Crear el producto
      const createdProduct = await createProduct(productData);
      console.log('Producto creado:', createdProduct);

      // Paso 2: Subir la imagen si existe
      if (image) {
        await uploadImage(createdProduct.id, image);
        console.log('Imagen subida exitosamente');
      }

      navigate('/products-page');
    } catch (error) {
      console.error('Error al publicar el producto:', error);
      setError('Hubo un error al publicar el producto. Intenta de nuevo.');
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
          <h2 className="text-2xl font-bold mb-6 text-center">Vender Producto</h2>

          {error && (
            <div className="text-red-500 text-center mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="productName" className="block text-gray-700 text-sm font-bold mb-2">
              Nombre del Producto
            </label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(DOMPurify.sanitize(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
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
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(DOMPurify.sanitize(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="4"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
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
                src={URL.createObjectURL(image)}
                alt="Vista previa"
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
