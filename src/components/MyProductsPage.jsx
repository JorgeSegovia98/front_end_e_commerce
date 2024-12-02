// MyProductsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { Pagination } from './Pagination';
import { getUserProducts } from 'services/ApiService';

const MyProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();
  const productsPerPage = 8;

  // Obtener el userId desde localStorage o el contexto del usuario autenticado
  const userId = 1; // Cambiar esto según la implementación de autenticación

  // Obtener los productos del usuario desde la API
  useEffect(() => {
    const fetchUserProductsData = async () => {
      if (userId) {
        const userProducts = await getUserProducts(userId);
        setProducts(userProducts);
      } else {
        console.error('No se encontró el userId');
      }
    };

    fetchUserProductsData();
  }, [userId]);

  // Filtrado de productos según la búsqueda
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  // Paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Editar producto
  const handleEditProduct = (productId) => {
    const productToEdit = products.find((product) => product.id === productId);
    setEditingProduct(productToEdit);
    navigate(`/edit-product/${productId}`);
  };

  // Volver a la página de productos
  const handleBackToProducts = () => {
    navigate('/products-page');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow mb-8">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 
              className="text-2xl font-bold text-blue-600 cursor-pointer"
              onClick={handleBackToProducts}
            >
              Tienda Virtual
            </h1>
            <button 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => navigate('/sell-product')}
            >
              Vender un producto
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
          </div>
        </div>
      </nav>

      {/* Productos */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-6">Mis Productos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentProducts.length === 0 ? (
            <div className="col-span-4 text-center text-gray-600 text-xl">
              No tienes productos registrados
            </div>
          ) : (
            currentProducts.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard product={product} />
                <button 
                  className="absolute top-2 right-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  onClick={() => handleEditProduct(product.id)}
                >
                  Editar
                </button>
              </div>
            ))
          )}
        </div>

        {/* Paginación */}
        <Pagination
          currentPage={currentPage}
          productsPerPage={productsPerPage}
          totalProducts={filteredProducts.length}
          paginate={paginate}
        />
      </div>
    </div>
  );
};

export default MyProductsPage;
