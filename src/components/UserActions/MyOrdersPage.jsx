import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Manejo de navegación
import { getOrders } from 'services/ApiService'; // Función para obtener headers de autenticación

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
         // Estados para manejar los pedidos, la carga y los errores
        const data = await getOrders(); 

        if (!Array.isArray(data)) {
          setError('Error al procesar la información de pedidos');
          setIsLoading(false);
          return;
        }

        const mappedOrders = data.map(order => ({
          id: order.id_pedido,
          total: order.totalDinero,
          fecha: new Date(order.fechaPedido).toLocaleDateString(),
          productos: [],
        }));

         // Mapear los pedidos para estructurarlos correctamente
        setOrders(mappedOrders);
      } catch (error) {
          // Mostrar un mensaje de error si ocurre algún problema al cargar los pedidos
        console.error('Error al obtener los pedidos:', error);
        setError('No se pudieron cargar los pedidos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();  // Llamar a la función para obtener los pedidos al montar el componente
  }, []);

   // Renderizar una pantalla de carga si los pedidos están cargando
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

  // Renderizar la lista de pedidos
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <button
        onClick={() => navigate('/products-page')}
        className="text-blue-600 hover:text-blue-800 font-bold mb-4 self-start px-4"
      >
        ← Volver a la tienda
      </button>

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
