import React from "react";

export function Logo() {
  return (
    <div className="flex justify-center mb-6">
      <img
        src="/logo.png"
        alt="Logo"
        className="h-16 w-16 rounded-full shadow-md"
      />
    </div>
  );
}
