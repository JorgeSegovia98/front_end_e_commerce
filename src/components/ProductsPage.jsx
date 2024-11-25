import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { Pagination } from './Pagination';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('all');
  const navigate = useNavigate();
  const productsPerPage = 8;

  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        title: "Producto 1",
        price: 99.99,
        description: "Descripción del producto 1",
        image: "https://placehold.co/600x400",
        rating: 4.5,
      },
      {
        id: 2,
        title: "Producto 2",
        price: 149.99,
        description: "Descripción del producto 2",
        image: "https://placehold.co/600x400",
        rating: 4.0,
      },
      {
        id: 3,
        title: "Producto 3",
        price: 149.99,
        description: "Descripción del producto 3",
        image: "https://placehold.co/600x400",
        rating: 4.0,
      },
      {
        id: 4,
        title: "Producto 4",
        price: 149.99,
        description: "Descripción del producto 4",
        image: "https://placehold.co/600x400",
        rating: 4.0,
      },
      {
        id: 5,
        title: "Producto 5",
        price: 149.99,
        description: "Descripción del producto 5",
        image: "https://placehold.co/600x400",
        rating: 4.0,
      },
      {
        id: 6,
        title: "Producto 6",
        price: 149.99,
        description: "Descripción del producto 6",
        image: "https://placehold.co/600x400",
        rating: 4.0,
      },
      {
        id: 7,
        title: "Producto 7",
        price: 149.99,
        description: "Descripción del producto 7",
        image: "https://placehold.co/600x400",
        rating: 4.0,
      },
      {
        id: 8,
        title: "Producto 8",
        price: 149.99,
        description: "Descripción del producto 8",
        image: "https://placehold.co/600x400",
        rating: 4.0,
      },
    ];

    setProducts(mockProducts);
  }, []);

  // Sorting function
  const sortProducts = (productsToSort) => {
    switch(sortOption) {
      case 'price-asc':
        return [...productsToSort].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...productsToSort].sort((a, b) => b.price - a.price);
      default:
        return productsToSort;
    }
  };

  // Filtered and sorted products
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

  const handleTitleClick = () => {
    navigate('/products-page');
  };

  const handleSellProduct = () => {
    navigate('/sell-product');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow mb-8">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 
              className="text-2xl font-bold text-blue-600 cursor-pointer"
              onClick={handleTitleClick}
            >
              Tienda Virtual
            </h1>
            <button 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={handleSellProduct}
            >
              Vender un producto
            </button>
          </div>
          <div className="flex items-center gap-4">
            {/* Filtros */}
            <select 
              className="border border-gray-300 rounded px-4 py-2"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
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

      {/* Productos */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Paginación */}
        <Pagination
          currentPage={currentPage}
          productsPerPage={productsPerPage}
          totalProducts={filteredAndSortedProducts.length}
          paginate={paginate}
        />
      </div>
    </div>
  );
};

export default ProductsPage;