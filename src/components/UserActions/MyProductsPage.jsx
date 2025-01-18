import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from 'components/PrincipalPage/ProductCard';
import { Pagination } from 'components/PrincipalPage/Pagination';
import { getUserProducts } from 'services/ApiService';

const MyProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', precio: '', descripcion: '' });
  const navigate = useNavigate();
  const productsPerPage = 8;

  useEffect(() => {
    const fetchUserProductsData = async () => {
      const userProducts = await getUserProducts();
      console.log("Productos cargados:", userProducts);
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

  // Manejar la apertura del popup para edición
  const handleEditProduct = (product) => {
    console.log("Producto seleccionado para editar:", product);
    setEditingProduct(product); // Aquí guardamos todo el objeto del producto
    setFormData({
      nombre: product.title, // Asegúrate de que `title` sea el campo correcto en tu objeto
      precio: product.price,
      descripcion: product.description,
    });
    setIsEditing(true);
  };

  // Manejar el cierre del popup
  const handleCloseEdit = () => {
    setIsEditing(false);
    setEditingProduct(null);
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Enviar datos actualizados al backend
  const handleSaveEdit = async () => {
    try {
      if (!editingProduct || !editingProduct.id) {
        throw new Error('El producto no tiene un ID válido.');
      }

      const response = await fetch(
        `https://backend-ecommerse-b6anfne4gqgacyc5.canadacentral-01.azurewebsites.net/productos/editar/${editingProduct.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${document.cookie.split('jwt_token=')[1]}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error('Error en el servidor:', errorDetails);
        throw new Error('Error al editar el producto');
      }

      const updatedProduct = await response.json();
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === updatedProduct.id
            ? {
                ...product,
                title: updatedProduct.nombre,
                price: updatedProduct.precio,
                description: updatedProduct.descripcion,
              }
            : product
        )
      );

      handleCloseEdit();
    } catch (error) {
      console.error(error);
    }
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
          ) : (
            currentProducts.map((product, index) => (
              <div key={product.id || index} className="relative">
                <ProductCard product={product} />
                <button
                  className="absolute top-2 right-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  onClick={() => handleEditProduct(product)}
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

      {/* Modal de edición */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <h3 className="text-xl font-bold mb-4">Editar Producto</h3>
            <div className="mb-4">
              <label className="block text-gray-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Precio</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={handleCloseEdit}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleSaveEdit}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProductsPage;
