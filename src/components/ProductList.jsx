import React, { useState, useEffect } from "react";
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from "reactstrap";
import { PlusCircle, Loader2, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingToCart, setAddingToCart] = useState({});
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const [cartCount, setCartCount] = useState(0);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://plantshop-server.onrender.com/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        setShowAddModal(false);
        setNewProduct({ name: "", description: "", price: "", image: "" });
        fetchProducts();
      }
    } catch (err) {
      setError("Failed to add product");
    }
  };

  useEffect(() => {
    console.log(cartCount, "kkk");
  }, [cartCount]);

  const fetchCartTotal = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = JSON.parse(atob(token.split(".")[1])).id;
      const response = await fetch(
        `https://plantshop-server.onrender.com/api/cart/total?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setCartCount(data?.total);
    } catch (err) {
      console.error(err);
    }
  };
  fetchCartTotal();

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://plantshop-server.onrender.com/api/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      console.log(data);
      setProducts(data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    console.log("Adding product to cart:", product);
    setAddingToCart((prev) => ({ ...prev, [product._id]: true }));
    try {
      const token = localStorage.getItem("token");
      const userId = JSON.parse(atob(token.split(".")[1])).id;
      console.log(userId);
      const response = await fetch("https://plantshop-server.onrender.com/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      toast.success(`${product.name} added to cart`);
      fetchCartTotal();
    } catch (err) {
      toast.error("Failed to add item to cart");
    } finally {
      setAddingToCart((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );

  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-600 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-serif mb-4">
            "In every walk with nature,
            <br />
            one receives far more than he seeks."
          </h2>
          <p className="text-lg">- John Muir</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Our Plants Collection</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              View Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              Add New Plant
            </button>
          </div>
        </div>

        {products.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center text-gray-500 italic">
              <p className="text-2xl font-bold">Oops!</p>
              <p className="my-4">
                It looks like we don't have any products right now.
              </p>
              <p className="text-sm">
                Check back soon, or <br className="md:hidden" /> maybe try
                searching for something else?
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="p-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardBody className="p-4">
                <CardTitle className="text-xl font-bold mb-2">
                  {product.name}
                </CardTitle>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <p className="text-2xl font-bold text-green-600">
                  ${product.price}
                </p>
              </CardBody>
              <CardFooter className="p-4 bg-gray-50">
                <button
                  onClick={() => addToCart(product)}
                  disabled={addingToCart[product.id]}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {addingToCart[product.id] ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </>
                  )}
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add New Plant</h2>
            <form onSubmit={handleAddProduct}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={newProduct.image}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, image: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Plant
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
