import React, { useState, useEffect } from 'react'; 
import { useParams, useLocation, useNavigate } from 'react-router-dom';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation(); // Obtener los datos del estado enviado desde ProductCard
  const [product, setProduct] = useState(state ? state.product : null); // Inicializar con los datos del estado o null
  const [search, setSearch] = useState('');

  // Cargar el producto si no se pasó desde la card
  useEffect(() => {
    if (!product) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`http://localhost:8080/data-api/productos/${id}`);
          if (!response.ok) {
            throw new Error('Error al obtener el producto');
          }
          const fetchedProduct = await response.json();
          setProduct(fetchedProduct);
        } catch (error) {
          console.error(error);
        }
      };

      fetchProduct();
    }
  }, [id, product]);

  const handleAddToCart = () => {
    console.log("handleAddToCart triggered");

    if (!product) {
      console.error('Producto no encontrado');
      return;
    }

    // Obtener el carrito desde localStorage (si existe), o crear uno vacío si no existe
    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    console.log("Carrito actual:", cart);

    // Verificar si el producto ya está en el carrito
    const existingProductIndex = cart.findIndex((item) => item.id === product.id);

    if (existingProductIndex !== -1) {
      // Si el producto ya está en el carrito, incrementamos la cantidad
      cart[existingProductIndex].quantity += 1;
      console.log('Producto actualizado en el carrito:', cart[existingProductIndex]);
    } else {
      // Si el producto no está en el carrito, lo agregamos con una cantidad de 1
      cart.push({ ...product, quantity: 1 });
      console.log('Producto agregado al carrito:', product);
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('cartItems', JSON.stringify(cart));
    console.log('Carrito actualizado en localStorage:', cart);

    // Redirigir al carrito
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
            <a
              href="#"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Buscar
            </a>
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
              <a
                href="#"
                onClick={handleAddToCart}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Añadir al carrito
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
