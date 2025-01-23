import React, { useState, useEffect, useRef } from "react";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getCookie } from "utils/Cookies";
import { useNavigate } from 'react-router-dom'; // Manejo de navegación

const GroupChatPage = () => {
  // Estados para mensajes y entrada del usuario
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const clientRef = useRef(null); // Referencia del cliente STOMP
  const nombreUsuario = getCookie("username"); // Obtener el nombre del usuario desde la cookie
  const navigate = useNavigate(); // Hook para navegar entre rutas

  useEffect(() => {
    // Configuración del cliente STOMP y conexión al servidor WebSocket
    const socket = new SockJS('https://backend-ecommerse-b6anfne4gqgacyc5.canadacentral-01.azurewebsites.net/chat-websocket');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: (frame) => {
        console.log('Conectado:', frame);

        // Suscripción al tópico para recibir mensajes
        client.subscribe('/topic/mensajes', (message) => {
          const parsedMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, parsedMessage]);
        });
      },
      onStompError: (frame) => {
        console.error('Error STOMP:', frame);
      },
    });

    // Activar el cliente y almacenar la referencia
    clientRef.current = client;
    client.activate();

    // Limpiar la conexión al desmontar el componente
    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, []);

  // Función para enviar mensajes
  const sendMessage = () => {
    if (messageInput.trim()) {
      const message = { contenido: messageInput, emisor: nombreUsuario };
      clientRef.current.publish({
        destination: '/app/enviarMensaje',
        body: JSON.stringify(message),
      });
      setMessageInput(""); // Limpiar el campo de entrada
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-100 py-6">
      {/* Botón de regreso a la página de productos */}
      <button
        onClick={() => navigate('/products-page')}
        className="text-blue-600 hover:text-blue-800 font-bold mb-4 self-start px-4"
      >
        ← Volver a la tienda
      </button>

      {/* Encabezado del chat */}
      <h1 className="text-4xl font-bold text-center text-gray-800">Chat Grupal</h1>

      {/* Contenedor del chat */}
      <div className="chat-container mt-8 mx-auto w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 overflow-auto h-96">
        <ul id="messages" className="space-y-4">
          {messages.map((message, index) => (
            <li
              key={index}
              className={`flex ${message.emisor === nombreUsuario ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg shadow-sm ${
                  message.emisor === nombreUsuario
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <span className="font-semibold">{message.emisor}:</span>
                <span className="ml-1">{message.contenido}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Contenedor de entrada de texto */}
      <div className="input-container mt-4 mx-auto max-w-2xl flex items-center justify-between px-4">
        <input
          type="text"
          id="messageInput"
          placeholder="Escribe un mensaje..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className="w-5/5 p-3 border border-gray-300 rounded-l-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={sendMessage}
          className="w-2/5 bg-indigo-600 text-white p-3 rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default GroupChatPage;
