import React from 'react';

export const Button = ({ type, text }) => {
  return (
    <button
      type={type}
      className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {text}
    </button>
  );
};