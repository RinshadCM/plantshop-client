import React from 'react';
import { LogOut, ShoppingCart, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any authentication data
    localStorage.clear();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-green-700 text-white shadow-md py-4 px-8 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <Link to="/products" className="text-xl font-bold flex items-center">
          <Home className="mr-2" />
          MyStore
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-6">
        <Link
          to="/products"
          className="text-lg hover:text-gray-200 transition duration-200"
        >
          Products
        </Link>
        <Link
          to="/cart"
          className="text-lg hover:text-gray-200 transition duration-200 flex items-center"
        >
          <ShoppingCart className="mr-1" /> Cart
        </Link>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center"
      >
        <LogOut className="mr-2" /> Logout
      </button>
    </nav>
  );
};

export default Navbar;
