import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from 'components/PrincipalPage/ProductCard';
import { Pagination } from 'components/PrincipalPage/Pagination';
import { getUserProducts } from 'services/ApiService';

const MyProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const productsPerPage = 8;

  useEffect(() => {
    const fetchUserProductsData = async () => {
      const userProducts = await getUserProducts();
      setProducts(userProducts);
    };

    fetchUserProductsData();
  }, []);

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
    navigate(`/edit-product/${productId}`);
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

      {/* Productos */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-6">Mis Productos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentProducts.length === 0 ? (
            <div className="col-span-4 text-center text-gray-600 text-xl">
              No tienes productos registrados
            </div>
          ) : 
            currentProducts.map((product, index) => (
              <div key={product.id || index} className="relative">
                <ProductCard product={product} />
                <button
                  className="absolute top-2 right-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  onClick={() => handleEditProduct(product.id)}
                >
                  Editar
                </button>
              </div>
            ))
          }
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
