import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter } from 'reactstrap';
import { Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      const userId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).id;
      const response = await fetch(`https://plantshop-server.onrender.com/api/cart?userId=${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
  
      if (!response.ok) throw new Error('Failed to fetch cart');
  
      const data = await response.json();
      console.log(data,"jkl");
      setCartItems(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };
  
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }
    setUpdating((prev) => ({ ...prev, [productId]: true }));
  
    try {
      const userId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).id;
      const response = await fetch(`https://plantshop-server.onrender.com/api/cart/${productId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ quantity: newQuantity, userId })
      });
  
      if (!response.ok) throw new Error('Failed to update quantity');
  
      const updatedItem = await response.json();
      setCartItems((items) =>
        items.map((item) => (item.productId === productId ? updatedItem : item))
      );
    } catch (err) {
      toast.error('Failed to update quantity');
    } finally {
      setUpdating((prev) => ({ ...prev, [productId]: false }));
    }
  };
  
  const removeItem = async (productId) => {
    try {
      const userId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).id;
      const response = await fetch(`https://plantshop-server.onrender.com/api/cart/${productId}?userId=${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
  
      if (!response.ok) throw new Error('Failed to remove item');
  
      setCartItems((items) => items.filter((item) => item.productId !== productId));
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };
  

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-green-600" />
    </div>
  );

  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="mb-4">Your cart is empty</p>
          <Link to="/products" className="text-green-600 hover:text-green-700">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {cartItems.map((item) => (
            <Card key={item.id}>
              <CardBody className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-gray-600">${item.price}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={updating[item.id] || item.quantity < 1}
                      className="px-2 py-1 bg-gray-200 rounded disabled:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">
                      {updating[item.productId] ? (
                        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                      ) : (
                        item.quantity
                      )}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={updating[item.id]}
                      className="px-2 py-1 bg-gray-200 rounded disabled:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </CardBody>
            </Card>
          ))}
          
          <CardFooter className="mt-6 p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center w-full">
              <span className="text-xl font-bold">Total: ${total.toFixed(2)}</span>
              <button
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </CardFooter>
        </div>
      )}
    </div>
  );
};

export default Cart;