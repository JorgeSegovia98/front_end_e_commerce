import React, { useState, useEffect, useRef } from "react";

const GroupChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    // Crear la conexión WebSocket
    socketRef.current = new WebSocket("ws://localhost:8080/chat-websocket");

    // Manejar la recepción de mensajes
    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    // Manejar errores en la conexión WebSocket
    socketRef.current.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    // Cerrar la conexión WebSocket al desmontar el componente
    return () => {
      socketRef.current.close();
    };
  }, []);

  // Función para enviar un mensaje
  const sendMessage = () => {
    if (messageInput.trim()) {
      const message = { contenido: messageInput, emisor: "Usuario" };
      socketRef.current.send(JSON.stringify(message));
      setMessageInput(""); // Limpiar el input después de enviar
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-100 py-6">
      <h1 className="text-4xl font-bold text-center text-gray-800">Chat Grupal</h1>
      <div className="chat-container mt-8 mx-auto w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 overflow-auto h-96">
        <ul id="messages" className="space-y-4">
          {messages.map((message, index) => (
            <li key={index} className="flex flex-col space-y-2">
              <div className="flex items-center">
                <span className="font-semibold text-indigo-600">{message.emisor}:</span>
                <span className="ml-2 text-gray-700">{message.contenido}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
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
