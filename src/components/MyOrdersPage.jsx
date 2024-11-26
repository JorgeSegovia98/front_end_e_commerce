import React, { useState, useEffect } from 'react';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8080/data-api/usuario/pedidos');
        if (!response.ok) {
          throw new Error('Error al cargar los pedidos');
        }
        const data = await response.json();
        
        // Map the orders to match the expected format
        const mappedOrders = data._embedded.pedidos.map(order => ({
          id: order.id,
          total: order.total,
          fecha: new Date(order.fecha).toLocaleDateString(),
          productos: order.productos.map(producto => ({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio
          }))
        }));

        setOrders(mappedOrders);
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError('No se pudieron cargar los pedidos');
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-600">Cargando pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Mis Pedidos</h1>
        
        {orders.length === 0 ? (
          <p className="text-center text-gray-600">No tienes pedidos realizados.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-semibold">Pedido #{order.id}</p>
                  <p className="text-gray-600">{order.fecha}</p>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-xl font-bold mb-3">Productos</h3>
                  <div className="space-y-2">
                    {order.productos.map((producto) => (
                      <div key={producto.id} className="flex justify-between">
                        <span>{producto.nombre}</span>
                        <span className="font-semibold">${producto.precio.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 border-t pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-xl font-bold text-green-600">${order.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;