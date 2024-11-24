import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import RegisterPage from "../components/RegisterPage";
import ForgotPassword from "../components/ForgotPassword";
import ProductsPage from "../components/ProductsPage";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/products-page" element={<ProductsPage />} />
      </Routes>
    </Router>
  );
}