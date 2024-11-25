import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { useCart } from './CartContext';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Lógica para obtener el producto (mock mientras no hay API)
    const mockProduct = {
      id: parseInt(id),
      title: `Producto ${id}`,
      price: 99.99,
      description: `Descripción detallada del producto ${id}...`,
      image: "https://placehold.co/600x400",
      rating: 5,
    };

    setProduct(mockProduct);
  }, [id]);

  const handleAddToCart = () => {
    
    // Obtiene el carrito actual del localStorage
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Verifica si el producto ya existe en el carrito
    const existingProduct = cart.find((item) => item.id === product.id);
    
    if (existingProduct) {
      // Incrementa la cantidad del producto si ya existe
      existingProduct.quantity += 1;
    } else {
      // Agrega el producto con cantidad inicial de 1
      cart.push({ ...product, quantity: 1 });
    }
    
    // Guarda el carrito actualizado en el localStorage
    localStorage.setItem('cartItems', JSON.stringify(cart));
    
    // Opcional: redirigir al carrito después de agregar el producto
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
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow mb-8">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Tienda Virtual</h1>
          <div className="flex items-center gap-4">
            {/* Filtros */}
            <select className="border border-gray-300 rounded px-4 py-2">
              <option value="all">Todos</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
            </select>
            {/* Barra de búsqueda */}
            <input
              type="text"
              placeholder="Buscar productos..."
              className="border border-gray-300 rounded px-4 py-2 w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Buscar
            </button>
          </div>
        </div>
      </nav>

      {/* Detalle del Producto */}
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
    </div>
  );
};
