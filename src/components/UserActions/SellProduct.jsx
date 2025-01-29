import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct, uploadImage } from 'services/ApiService';
import { getUserIdFromToken } from 'utils/Auth';
import DOMPurify from 'dompurify';

export const SellProduct = () => {
  const userId = getUserIdFromToken(); // ID del usuario extraído del token JWT
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null); // Imagen seleccionada
  const [error, setError] = useState(''); // Manejo de errores
  const navigate = useNavigate();

  // Manejo de selección de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 3 * 1024 * 1024; // Tamaño máximo: 3 MB
  
      // Validar el tamaño del archivo
      if (file.size > maxSize) {
        setError('La imagen no debe superar los 3 MB.');
        setImage(null);
        return;
      }
  
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result; // Obtener el contenido del archivo
        const uint8Array = new Uint8Array(arrayBuffer); // Convertir a un arreglo de bytes
  
        // Firmas mágicas para PNG y JPEG
        const pngSignature = [0x89, 0x50, 0x4e, 0x47]; // 4 primeros bytes de un archivo PNG
        const jpegSignature = [0xff, 0xd8, 0xff]; // 3 primeros bytes de un archivo JPEG
  
        // Verificar si los primeros bytes coinciden con PNG o JPEG
        const isPng = pngSignature.every((byte, index) => byte === uint8Array[index]);
        const isJpeg = jpegSignature.every((byte, index) => byte === uint8Array[index]);
  
        if (isPng || isJpeg) {
          setImage(file); // Si pasa la validación, guardar el archivo
          setError(''); // Limpiar cualquier error previo
        } else {
          setError('El archivo no es una imagen válida.');
          setImage(null); // Limpiar la imagen si no es válida
        }
      };
  
      reader.onerror = () => {
        setError('Hubo un error al leer el archivo.');
        setImage(null);
      };
  
      // Leer los primeros 4 bytes para verificar la firma mágica
      reader.readAsArrayBuffer(file.slice(0, 4));
    }
  };
  

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError('Debe seleccionar una imagen válida antes de publicar el producto.');
      return;
    }

    // Sanitizar entradas para prevenir ataques XSS
    const sanitizedProductName = DOMPurify.sanitize(productName);
    const sanitizedDescription = DOMPurify.sanitize(description);

    // Crear el objeto del producto
    const productData = {
      nombre: sanitizedProductName,
      precio: parseFloat(price),
      descripcion: sanitizedDescription,
      usuario: { id: userId }, // Asociar el producto al usuario autenticado
    };

    try {
      // Crear el producto en el backend
      const createdProduct = await createProduct(productData);

      // Subir la imagen asociada
      await uploadImage(createdProduct.id, image);

      // Redirigir a la página de productos tras el éxito
      navigate('/products-page');
    } catch (error) {
      setError('Hubo un error al publicar el producto. Intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra de navegación */}
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

      {/* Formulario de publicación de producto */}
      <div className="container mx-auto px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Vender Producto</h2>

          {/* Mostrar errores si existen */}
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}

          {/* Campo: Nombre del Producto */}
          <div className="mb-4">
            <label
              htmlFor="productName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Nombre del Producto
            </label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) =>
                setProductName(DOMPurify.sanitize(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Campo: Precio */}
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
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

          {/* Campo: Descripción */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) =>
                setDescription(DOMPurify.sanitize(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="4"
              required
            />
          </div>

          {/* Campo: Imagen del Producto */}
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
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

          {/* Botón de enviar */}
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
