import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from 'components/PrincipalPage/ProductCard';
import { Pagination } from 'components/PrincipalPage/Pagination';
import { getUserProducts, editProduct } from 'services/ApiService';

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
    const fetchUserProducts = async () => {
      try {
        const userProducts = await getUserProducts();
        setProducts(userProducts);
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    };

    fetchUserProducts();
  }, []);

  // Lógica de edición
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.title,
      precio: product.price,
      descripcion: product.description,
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedProduct = await editProduct(editingProduct.id, formData);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === updatedProduct.id
            ? { ...product, title: updatedProduct.nombre, price: updatedProduct.precio, description: updatedProduct.descripcion }
            : product
        )
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    }
  };

  // Filtrado y paginación
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-100">
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
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-6">Mis Productos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <button
                className="absolute top-2 right-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                onClick={() => handleEditProduct(product)}
              >
                Editar
              </button>
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          productsPerPage={productsPerPage}
          totalProducts={filteredProducts.length}
          paginate={paginate}
        />
      </div>

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
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Precio</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setIsEditing(false)}
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
