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
import { SellProduct } from "../components/SellProduct";
import MyProductsPage from "components/MyProductsPage";
import MyOrdersPage from "../components/MyOrdersPage"; 
import GroupChatPage from "../components/GroupChatPage";


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
          <Route path="/sell-product" element={<SellProduct />} />
          <Route path="/my-products" element={<MyProductsPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} /> {/* Nueva ruta */}
          <Route path="/group-chat" element={<GroupChatPage />} /> {/* Nueva ruta */}
        </Routes>
      </CartProvider>
    </Router>
  );
}