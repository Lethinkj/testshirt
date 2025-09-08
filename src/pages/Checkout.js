import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../supabaseClient';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [shipping, setShipping] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchCart = async () => {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, products(*)')
        .eq('user_id', user.id);
      if (error) {
        console.error('Error fetching cart:', error);
        alert('Failed to load cart');
      } else {
        setCart(data);
      }
    };
    fetchCart();
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    if (!shipping.name || !shipping.address || !shipping.city || !shipping.postalCode || !shipping.country) {
      alert('Please fill in all shipping details');
      return;
    }

    setLoading(true);
    try {
      const total = cart.reduce((sum, item) => sum + item.quantity * item.products.price, 0);
      const response = await fetch('https://ssycjlrhrvyfupvrzpgd.supabase.co/functions/v1/create-checkout-session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems: cart, total, shipping }),
      });

      const { sessionId } = await response.json();
      if (!sessionId) throw new Error('Failed to create checkout session');

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw error;

      // Note: Post-payment logic (clear cart, save orders) is handled in Edge Function or success page
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div>
      <Navbar />
      <div className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="font-poppins font-bold text-4xl md:text-5xl text-black text-center mb-4">
            Checkout
          </h1>
          {cart.length === 0 ? (
            <p className="font-open-sans text-gray-500 text-center">
              Your cart is empty. <a href="/polo" className="text-red-500">Start shopping</a>.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Cart Summary */}
              <div>
                <h2 className="font-poppins font-bold text-2xl text-black mb-4">Order Summary</h2>
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center p-4 bg-gray-100 rounded-lg mb-4">
                    <img
                      src={item.products.image_url || 'https://via.placeholder.com/192'}
                      alt={item.products.name}
                      className="w-24 h-24 object-cover mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-poppins font-bold text-xl">{item.products.name}</h3>
                      <p className="font-open-sans text-gray-500">
                        ${item.products.price} x {item.quantity} = ${(item.products.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                <p className="font-poppins font-bold text-xl text-black">
                  Total: ${cart.reduce((sum, item) => sum + item.quantity * item.products.price, 0).toFixed(2)}
                </p>
              </div>

              {/* Shipping Form */}
              <div>
                <h2 className="font-poppins font-bold text-2xl text-black mb-4">Shipping Details</h2>
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                  <input
                    type="text"
                    name="name"
                    value={shipping.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="w-full p-3 mb-4 border border-gray-300 rounded font-open-sans"
                  />
                  <input
                    type="text"
                    name="address"
                    value={shipping.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    className="w-full p-3 mb-4 border border-gray-300 rounded font-open-sans"
                  />
                  <input
                    type="text"
                    name="city"
                    value={shipping.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full p-3 mb-4 border border-gray-300 rounded font-open-sans"
                  />
                  <input
                    type="text"
                    name="postalCode"
                    value={shipping.postalCode}
                    onChange={handleInputChange}
                    placeholder="Postal Code"
                    className="w-full p-3 mb-4 border border-gray-300 rounded font-open-sans"
                  />
                  <input
                    type="text"
                    name="country"
                    value={shipping.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                    className="w-full p-3 mb-4 border border-gray-300 rounded font-open-sans"
                  />
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full bg-red-500 text-white font-poppins font-bold py-2 rounded-full hover:bg-red-700 disabled:bg-red-300"
                  >
                    {loading ? 'Processing...' : 'Proceed to Payment'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;