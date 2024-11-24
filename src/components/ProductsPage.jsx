// src/components/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { Pagination } from './Pagination';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    // Datos de ejemplo mientras no hay API
    const mockProducts = [
      {
        id: 1,
        title: "Producto 1",
        price: 99.99,
        description: "Descripción del producto 1",
        image: "/api/placeholder/400/320"
      },
      {
        id: 2,
        title: "Producto 2",
        price: 149.99,
        description: "Descripción del producto 2",
        image: "/api/placeholder/400/320"
      },
      // Agrega más productos de ejemplo aquí
    ];

    setProducts(mockProducts);
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Productos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        productsPerPage={productsPerPage}
        totalProducts={products.length}
        paginate={paginate}
      />
    </div>
  );
};

export default ProductsPage;