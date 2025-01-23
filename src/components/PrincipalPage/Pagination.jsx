import React from 'react';

// Componente para la paginación
// Props:
// - currentPage: Página actual seleccionada.
// - productsPerPage: Número de productos por página.
// - totalProducts: Total de productos disponibles.
// - paginate: Función que se ejecuta al seleccionar una página.
export const Pagination = ({ currentPage, productsPerPage, totalProducts, paginate }) => {
  const pageNumbers = []; // Array para almacenar los números de página.

  // Calculamos la cantidad de páginas necesarias.
  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-6">
      {/* Iteramos sobre los números de página para crear botones */}
      {pageNumbers.map(number => (
        <button
          key={number} // Clave única para cada botón.
          onClick={() => paginate(number)} // Llamamos a la función paginate al hacer clic.
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === number
              ? 'bg-indigo-600 text-white' // Estilo para la página activa.
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300' // Estilo para páginas no activas.
          }`}
        >
          {number} {/* Número de la página */}
        </button>
      ))}
    </div>
  );
};
