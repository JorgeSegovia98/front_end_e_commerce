import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Manejo de navegación
import { getAuthHeaders } from 'services/ApiService'; // Función para obtener headers de autenticación

const API = 'https://backend-ecommerse-b6anfne4gqgacyc5.canadacentral-01.azurewebsites.net';

const MyOrdersPage = () => {
  // Estados para manejar los pedidos, la carga y los errores
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Hook para redirigir a otras páginas

  useEffect(() => {
    // Función asíncrona para obtener los pedidos del usuario
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API}/pedidos/usuario`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error('Error al cargar los pedidos');
        }

        const data = await response.json();
        console.log('Respuesta del servidor:', data);

        if (!Array.isArray(data)) {
          console.error('Formato de respuesta inesperado:', data);
          setError('Error al procesar la información de pedidos');
          setIsLoading(false);
          return;
        }

        // Mapear los pedidos para estructurarlos correctamente
        const mappedOrders = data.map(order => ({
          id: order.id_pedido,
          total: order.totalDinero,
          fecha: new Date(order.fechaPedido).toLocaleDateString(),
          productos: [], // Se deja vacío ya que no hay datos de productos
        }));

        setOrders(mappedOrders);
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError('No se pudieron cargar los pedidos');
        setIsLoading(false);
      }
    };

    fetchOrders(); // Llamar a la función para obtener los pedidos al montar el componente
  }, []);

  // Renderizar una pantalla de carga si los pedidos están cargando
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-600">Cargando pedidos...</p>
      </div>
    );
  }

  // Mostrar un mensaje de error si ocurre algún problema al cargar los pedidos
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
      {/* Botón para regresar a la página de productos */}
      <button
        onClick={() => navigate('/products-page')} // Redirigir usando navigate
        className="text-blue-600 hover:text-blue-800 font-bold mb-4 self-start px-4"
      >
        ← Volver a la tienda
      </button>

      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Mis Pedidos</h1>

        {/* Mostrar un mensaje si no hay pedidos */}
        {orders.length === 0 ? (
          <p className="text-center text-gray-600">No tienes pedidos realizados.</p>
        ) : (
          <div className="space-y-6">
            {/* Listar los pedidos */}
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
