import React from 'react';
import logo from '../assets/logo.svg';

export const Logo = () => {
  return (
    <div className="flex justify-center">
      <img height= "150px" width="150px" src={logo} alt="logo de la empresa" />
    </div>
  )
};