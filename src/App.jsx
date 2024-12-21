import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/Signup';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Navbar from './components/Navbar'; // Import the Navbar
import { AuthProvider } from './context/AuthContext';
import './index.css';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  const AuthRoutes = () => {
    const location = useLocation();
    const isAuthRoute = ['/products', '/cart'].includes(location.pathname);

    return (
      <>
        {isAuthRoute && <Navbar />}
        <Routes>
          {/* Authentication Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
        </Routes>
      </>
    );
  };

  return (
    <AuthProvider>
      <Router>
        <AuthRoutes />
      </Router>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{ duration: 3000 }}
      />
    </AuthProvider>
  );
};

export default App;
