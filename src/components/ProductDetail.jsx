import React, { useState, useEffect } from 'react'; 
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [product, setProduct] = useState(state ? state.product : null);
  const [search, setSearch] = useState('');
  const { addToCart, getCartCount } = useCart();

  // Fetch product details if not passed from previous page
  useEffect(() => {
    if (!product) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`http://localhost:8080/data-api/productos/${id}`);
          if (!response.ok) {
            throw new Error('Error al obtener el producto');
          }
          const fetchedProduct = await response.json();
          // Map the fetched product to match your expected format
          const mappedProduct = {
            id: fetchedProduct.id,
            title: fetchedProduct.nombre,
            price: fetchedProduct.precio,
            description: fetchedProduct.descripcion,
            image: fetchedProduct.imagen || 'https://placehold.co/600x400',
            rating: 4 // You might want to add a rating field in your backend
          };
          setProduct(mappedProduct);
        } catch (error) {
          console.error(error);
          navigate('/products-page');
        }
      };

      fetchProduct();
    }
  }, [id, product, navigate]);

  const handleAddToCart = () => {
    if (!product) {
      console.error('Producto no encontrado');
      return;
    }

    // Add product to cart
    addToCart(product);

    // Navigate to cart
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
          <div className="flex items-center gap-4">
            <h1 
              className="text-2xl font-bold text-blue-600 cursor-pointer"
              onClick={() => navigate('/products-page')}
            >
              Tienda Virtual
            </h1>
            <button 
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => navigate('/cart')}
            >
              Carrito ({getCartCount()})
            </button>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="border border-gray-300 rounded px-4 py-2 w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button 
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              onClick={() => navigate('/products-page')}
            >
              Buscar
            </button>
          </div>
        </div>
      </nav>

      {/* Product Detail */}
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
            <p className="text-2xl font-bold text-indigo-600">${product.price.toFixed(2)}</p>
            <p className="text-gray-600">{product.description}</p>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full"
              >
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};