import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);

  // Si no se encuentra el contexto, se lanza un error para prevenir el mal uso del hook fuera del provider.
  // Esto es importante para la integridad de la aplicación.
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Inicialización del carrito desde el localStorage, si existe.
  // Seguridad: Aunque estamos obteniendo los datos del localStorage, debemos asegurarnos
  // que solo almacenamos información no sensible en él (como el carrito de compras, pero no datos de tarjetas de crédito).
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Almacenamos el carrito en el localStorage cada vez que cambie.
  // Asegúrate de que la información almacenada en el localStorage sea segura y no incluya datos sensibles.
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Función para agregar un producto al carrito
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // Si el producto ya está en el carrito, incrementamos la cantidad.
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Si el producto no está en el carrito, lo agregamos con cantidad 1.
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // Función para eliminar un producto del carrito
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Función para actualizar la cantidad de un producto en el carrito
  // Seguridad: Asegúrate de que la cantidad proporcionada sea un número entero válido para evitar manipulaciones de datos.
  const updateQuantity = (productId, quantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: parseInt(quantity) } // Se convierte la cantidad a número entero
          : item
      )
    );
  };

  // Calcula el total del carrito
  // Seguridad: El total se calcula solo con los datos que tenemos en el carrito y no se exponen datos sensibles.
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calcula la cantidad total de artículos en el carrito
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Función para vaciar el carrito
  const clearCart = () => {
    setCartItems([]); // Vacía el estado del carrito
    localStorage.removeItem('cartItems'); // Elimina los datos del carrito del localStorage
    // Seguridad: Es importante que los datos sensibles no se queden almacenados innecesariamente en localStorage.
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartTotal,
      getCartCount,
      clearCart // Exponemos el método para vaciar el carrito
    }}>
      {children}
    </CartContext.Provider>
  );
};
