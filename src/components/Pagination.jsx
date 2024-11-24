import React from 'react';

const Pagination = ({ currentPage, productsPerPage, totalProducts, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center mt-6">
      <ul className="inline-flex items-center">
        {pageNumbers.map((pageNumber) => (
          <li key={pageNumber} className="mr-2">
            <button
              onClick={() => paginate(pageNumber)}
              className={`px-3 py-2 rounded-lg text-gray-500 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:text-indigo-600 ${
                currentPage === pageNumber ? 'text-indigo-600 font-bold' : ''
              }`}
            >
              {pageNumber}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;