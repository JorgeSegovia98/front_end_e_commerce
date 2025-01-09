import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "../components/CartLogic/CartContext";
import { CartIcon } from "../components/CartLogic/CartIcon";
import Home from "../components/Login/Home";
import { ProductDetail } from "../components/UserActions/ProductDetail";
import { Cart } from "../components/CartLogic/Cart";
import { Payment } from "../components/UserActions//Payment";
import RegisterPage from "../components/Login/RegisterPage";
import ForgotPassword from "../components/Login/ForgotPassword";
import ProductsPage from "../components/PrincipalPage/ProductsPage";
import { SellProduct } from "../components/UserActions/SellProduct";
import MyProductsPage from "components/UserActions/MyProductsPage";
import MyOrdersPage from "../components/UserActions/MyOrdersPage"; 
import GroupChatPage from "../components/UserActions/GroupChatPage";


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