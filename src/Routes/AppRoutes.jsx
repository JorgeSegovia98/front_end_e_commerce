// src/routes/AppRoutes.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "../components/CartContext";
import { CartIcon } from "../components/CartIcon";
import Home from "../components/Home";
import { ProductDetail } from "../components/ProductDetail";
import { Cart } from "../components/Cart";
import { Payment } from "../components/Payment";
import RegisterPage from "../components/RegisterPage";
import ForgotPassword from "../components/ForgotPassword";
import ProductsPage from "../components/ProductsPage";

export default function AppRoutes() {
  return (
    <Router>
      <CartProvider>
        <CartIcon />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/products-page" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}