import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination } from './Pagination';

const MyProductsCard = ({ product, onEdit }) => {
  return (
    <div className="border border-gray-300 rounded shadow-sm p-4 hover:shadow-md">
      <img src={product.image} alt={product.title} className="w-full h-40 object-cover mb-4" />
      <h3 className="text-lg font-semibold">{product.title}</h3>
      <p className="text-sm text-gray-600">{product.description}</p>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-xl font-bold">${product.price}</span>
        <span className="text-yellow-500">★ {product.rating}</span>
      </div>
      <button 
        className="mt-4 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600" 
        onClick={() => onEdit(product)}
      >
        Editar Producto
      </button>
    </div>
  );
};

export const MyProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  const productsPerPage = 8;

  // Load products from localStorage on component mount
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(storedProducts);
  }, []);

  // Handle edit product
  const handleEditProduct = (product) => {
    setEditingProduct({...product});
    setPreviewImage(product.image);
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setEditingProduct(prev => ({...prev, image: reader.result}));
    };
    
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Handle save edited product
  const handleSaveEdit = () => {
    const updatedProducts = products.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    );
    
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setEditingProduct(null);
    setPreviewImage(null);
  };

  // Handle delete product
  const handleDeleteProduct = () => {
    const filteredProducts = products.filter(p => p.id !== editingProduct.id);
    
    setProducts(filteredProducts);
    localStorage.setItem('products', JSON.stringify(filteredProducts));
    setEditingProduct(null);
    setPreviewImage(null);
  };

  // Filtered products
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
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
          <input
            type="text"
            placeholder="Buscar mis productos..."
            className="border border-gray-300 rounded px-4 py-2 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </nav>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 text-white p-6 rounded-t-xl flex justify-between items-center">
              <h2 className="text-2xl font-bold">Editar Producto</h2>
              <button 
                onClick={() => {
                  setEditingProduct(null);
                  setPreviewImage(null);
                }}
                className="text-white hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 grid md:grid-cols-2 gap-6">
              {/* Image Section */}
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Imagen del Producto</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                {previewImage && (
                  <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-2">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-full h-64 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
              
              {/* Details Section */}
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Nombre del Producto</label>
                  <input
                    type="text"
                    value={editingProduct.title}
                    onChange={(e) => setEditingProduct({...editingProduct, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Nombre del producto"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Precio</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Precio del producto"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows="4"
                    placeholder="Descripción del producto"
                  />
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="bg-gray-100 p-6 rounded-b-xl flex justify-between">
              <button 
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition duration-300 flex items-center gap-2"
                onClick={handleDeleteProduct}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Eliminar
              </button>
              <button 
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300 flex items-center gap-2"
                onClick={handleSaveEdit}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                  <path fillRule="evenodd" d="M2 16V6h4.828l-2 2H4v6h6v-1.172l2-2V18H2z" clipRule="evenodd" />
                </svg>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Productos */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <MyProductsCard 
              key={product.id} 
              product={product} 
              onEdit={handleEditProduct} 
            />
          ))}
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