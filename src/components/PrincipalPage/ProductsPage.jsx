import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { Pagination } from './Pagination';
import { getAllProducts, getProductImage } from 'services/ApiService';
import { useCart } from '../CartLogic/CartContext';
import { deleteAllCookies } from 'utils/Cookies';
import DOMPurify from 'dompurify';

// Página principal de productos
const ProductsPage = () => {
  // Estados para manejar los datos de los productos, paginación, búsqueda, ordenamiento, carga y errores
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { getCartCount } = useCart(); // Hook para obtener datos del carrito
  const productsPerPage = 8; // Número de productos por página

  // Efecto para obtener los productos al cargar la página
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true); // Activa el indicador de carga
      try {
        // Obtener productos de la API
        const fetchedProducts = await getAllProducts();

        // Mapeamos los productos y cargamos sus imágenes de forma concurrente
        const mappedProducts = await Promise.all(
          fetchedProducts.map(async (product) => {
            let image = 'https://placehold.co/600x400'; // Placeholder en caso de error con la imagen
            try {
              image = await getProductImage(product.id); // Intentar obtener la imagen del producto
            } catch (imageError) {
              // En caso de error, se usa la imagen por defecto
            }
            return {
              id: product.id,
              title: product.nombre,
              price: product.precio,
              description: product.descripcion,
              image,
              rating: 4, // Calificación fija por ahora
            };
          })
        );

        setProducts(mappedProducts); // Establece los productos en el estado
      } catch (error) {
        setError('Error al cargar los productos'); // Mensaje de error en caso de fallo
      } finally {
        setIsLoading(false); // Finaliza el indicador de carga
      }
    };

    fetchProducts();
  }, []);

  // Función para ordenar los productos según la opción seleccionada
  const sortProducts = (productsToSort) => {
    switch (sortOption) {
      case 'price-asc':
        return [...productsToSort].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...productsToSort].sort((a, b) => b.price - a.price);
      default:
        return productsToSort;
    }
  };

  // Filtrar y ordenar los productos según búsqueda y opción seleccionada
  const filteredAndSortedProducts = sortProducts(
    products.filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase())
    )
  );

  // Calcular índices de paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Función para manejar el cambio de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Navegar a la página de mis productos
  const handleMyProducts = () => {
    navigate('/my-products');
  };

  // Navegar a la página de mis pedidos
  const handleMyOrders = () => {
    navigate('/my-orders');
  };

  // Navegar al chat grupal
  const handleGroupChat = () => {
    navigate('/group-chat');
  };

  // Cerrar sesión y eliminar cookies
  const handleLogout = () => {
    deleteAllCookies();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow mb-8">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h1
              className="text-xl sm:text-2xl font-bold text-blue-600 cursor-pointer"
              onClick={() => navigate('/products-page')}
            >
              Tienda Virtual
            </h1>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm sm:text-base"
              onClick={() => navigate('/sell-product')}
            >
              Vender un producto
            </button>
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm sm:text-base"
              onClick={handleMyProducts}
            >
              Ver mis productos
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm sm:text-base"
              onClick={handleMyOrders}
            >
              Mis pedidos
            </button>
            <button
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 text-sm sm:text-base"
              onClick={handleGroupChat}
            >
              Chat grupal
            </button>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="border border-gray-300 rounded px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
            </select>
            <input
              type="text"
              placeholder="Buscar productos..."
              className="border border-gray-300 rounded px-2 py-1 sm:px-4 sm:py-2 w-40 sm:w-64 text-sm sm:text-base"
              value={search}
              onChange={(e) => setSearch(DOMPurify.sanitize(e.target.value))}
            />
            <button
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs sm:text-sm"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Productos */}
      <div className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="text-center text-gray-600 text-xl">
            Cargando productos...
          </div>
        ) : error ? (
          <div className="text-center text-red-600 text-xl">
            {error}
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="text-center text-gray-600 text-xl">
            No se encontraron productos
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

        {/* Paginación */}
        {filteredAndSortedProducts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            productsPerPage={productsPerPage}
            totalProducts={filteredAndSortedProducts.length}
            paginate={paginate}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
