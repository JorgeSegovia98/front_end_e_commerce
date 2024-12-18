import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { Pagination } from './Pagination';
import { getAllProducts, getProductImage } from 'services/ApiService';
import { useCart } from './CartContext';


const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const productsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const fetchedProducts = await getAllProducts();

        
        const mappedProducts = fetchedProducts._embedded.productos.map((product) => ({
          id: product.id,
          title: product.nombre,
          price: product.precio,
          description: product.descripcion,
          image: null, 
          rating: 4
        }));

        
        for (const mappedProduct of mappedProducts) {
          const image = await getProductImage(mappedProduct.id);
          mappedProduct.image = image || 'https://placehold.co/600x400'; 
        }

        setProducts(mappedProducts);
      } catch (error) {
        setError('Error al cargar los productos');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  const filteredAndSortedProducts = sortProducts(
    products.filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase())
    )
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleMyProducts = () => {
    navigate('/my-products');
  };

  const handleMyOrders = () => {
    navigate('/my-orders');
  };

  const handleGroupChat = () => {
    navigate('/group-chat');
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

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
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => navigate('/sell-product')}
            >
              Vender un producto
            </button>
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              onClick={handleMyProducts}
            >
              Ver mis productos
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleMyOrders}
            >
              Mis pedidos
            </button>
            <button
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              onClick={handleGroupChat}
            >
              Chat grupal
            </button>
          </div>
          <div className="flex items-center gap-4">
            <select
              className="border border-gray-300 rounded px-4 py-2"
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
              className="border border-gray-300 rounded px-4 py-2 w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              onClick={handleSearch}
            >
              Buscar
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    image: product.image, 
                  }}
                  onDetailsClick={() => navigate(`/product-detail/${product.id}`, { state: { product } })}
                />
              ))}
            </div>

            {/* Paginación */}
            <Pagination
              currentPage={currentPage}
              productsPerPage={productsPerPage}
              totalProducts={filteredAndSortedProducts.length}
              paginate={paginate}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;