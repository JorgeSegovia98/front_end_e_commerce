import React, { useEffect, useState } from 'react';
import { getOrders } from '../../services/ApiService';

export const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error al obtener pedidos:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Historial de Pedidos</h1>
      {orders.map((order, index) => (
        <div key={index} className="bg-white rounded shadow p-4 mb-4">
          <p><strong>ID Pedido:</strong> {order.id}</p>
          <p><strong>Fecha:</strong> {order.fecha}</p>
          <p><strong>Total:</strong> ${order.total}</p>
        </div>
      ))}
    </div>
  );
};
