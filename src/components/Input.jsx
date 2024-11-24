import React from "react";

export function Input({ label, type, name, placeholder }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
      />
    </div>
  );
}
