import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from '../components/CartLogic/CartContext';
import { CartIcon } from '../components/CartLogic/CartIcon';
import Home from '../components/Login/Home';
import { ProductDetail } from '../components/UserActions/ProductDetail';
import { Cart } from '../components/CartLogic/Cart';
import { Payment } from '../components/UserActions/Payment';
import RegisterPage from '../components/Login/RegisterPage';
import ForgotPassword from '../components/Login/ForgotPassword';
import ProductsPage from '../components/PrincipalPage/ProductsPage';
import { SellProduct } from '../components/UserActions/SellProduct';
import MyProductsPage from '../components/UserActions/MyProductsPage';
import MyOrdersPage from '../components/UserActions/MyOrdersPage';
import GroupChatPage from '../components/UserActions/GroupChatPage';
import { getAuthenticatedUser } from '../services/ApiService';

function PrivateRoute({ children }) {
  const user = getAuthenticatedUser();
  return user ? children : <Navigate to="/" />;
}

export default function AppRoutes() {
  return (
    <Router>
      <CartProvider>
        <CartIcon />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/products-page"
            element={
              <PrivateRoute>
                <ProductsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <PrivateRoute>
                <ProductDetail />
              </PrivateRoute>
            }
          />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/payment"
            element={
              <PrivateRoute>
                <Payment />
              </PrivateRoute>
            }
          />
          <Route
            path="/sell-product"
            element={
              <PrivateRoute>
                <SellProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-products"
            element={
              <PrivateRoute>
                <MyProductsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <PrivateRoute>
                <MyOrdersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/group-chat"
            element={
              <PrivateRoute>
                <GroupChatPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </CartProvider>
    </Router>
  );
}
