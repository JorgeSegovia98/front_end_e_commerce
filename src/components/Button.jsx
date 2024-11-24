import React from "react";

export function Button({ type, text }) {
  return (
    <button
      type={type}
      className="w-full py-2 px-4 text-white font-semibold bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {text}
    </button>
  );
}
