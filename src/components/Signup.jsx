import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImg from '../assets/images/fliptree-bg.jpg';
import toast from 'react-hot-toast';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://plantshop-server.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/products');
      }else{
        setError('Registration failed. Please try again.');
        toast.error('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="flex w-full max-w-6xl bg-white rounded-lg overflow-hidden">
        {/* Form section */}
        <div className="w-1/2 p-8">
          <div className="mb-12">
            <div className="text-sm text-blue-500 font-medium mb-2">START FOR FREE</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create new account<span className="text-blue-500">.</span></h1>
            <p className="text-gray-600">
              Already a Member?{' '}
              <Link to="/" className="text-blue-500 hover:underline">
                Log in
              </Link>
            </p>
          </div>

          {error && (
            <div className="text-red-500 bg-red-100 p-2 rounded mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  placeholder="First name"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value + ' ' + formData.name.split(' ')[1] })}
                />
              </div>
              <div>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  placeholder="Last name"
                  onChange={(e) => setFormData({ ...formData, name: formData.name.split(' ')[0] + ' ' + e.target.value })}
                />
              </div>
            </div>
            <div>
              <input
                type="email"
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <input
                type="password"
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create account
              </button>
            </div>
          </form>
        </div>

        {/* Image section */}
        <div className="w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/10"></div>
          <img
            src={backgroundImg}
            alt="Mountain lake"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
