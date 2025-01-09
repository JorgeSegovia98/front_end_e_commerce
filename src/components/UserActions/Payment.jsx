import React, { useState, useEffect } from 'react';
import { Button } from '../Login/Button';
import { useNavigate } from 'react-router-dom';
import visaImg from '../../assets/visa.png';
import mastercardImg from '../../assets/mastercard.png';

export const Payment = () => {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  // Obtener el total del pedido desde localStorage
  useEffect(() => {
    const storedTotal = localStorage.getItem('totalPedido');
    if (storedTotal) {
      setTotal(parseFloat(storedTotal));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar los campos del formulario
    if (!cardNumber || !expiry || !cvv || !name) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    const paymentData = {
      cardNumber,
      expiry,
      cvv,
      name,
      total,
    };

    try {
      const response = await fetch('http://localhost:8080/api/pagos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        alert('Pago realizado con éxito');
        navigate('/success');
      } else {
        alert('Error al procesar el pago');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error al procesar el pago');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Método de pago</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Número de tarjeta</label>
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              maxLength={16}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de expiración</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                maxLength={5}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">CVV</label>
              <input
                type="text"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                maxLength={3}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del titular</label>
            <input
              type="text"
              placeholder="Nombre como aparece en la tarjeta"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="text-right">
            <p className="text-lg font-bold text-gray-700">Total a pagar: ${total.toFixed(2)}</p>
          </div>

          <Button type="submit" text="Confirmar pago" />
        </form>
      </div>

      <div className="mt-6 flex justify-center items-center gap-4">
        <img src={visaImg} alt="visa" className="h-8" />
        <img src={mastercardImg} alt="mastercard" className="h-8" />
      </div>

      <button
        onClick={() => navigate('/products-page')}
        className="mt-6 w-full bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 text-center"
      >
        Volver a la tienda
      </button>
    </div>
  );
};
