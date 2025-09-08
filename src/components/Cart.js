import { useEffect, useState, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchCart = async () => {
        const { data } = await supabase
          .from('cart_items')
          .select('*, products(*)')
          .eq('user_id', user.id);
        setCart(data);
      };
      fetchCart();
    }
  }, [user]);

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) {
      await supabase.from('cart_items').delete().eq('id', id);
    } else {
      await supabase.from('cart_items').update({ quantity }).eq('id', id);
    }
    const { data } = await supabase.from('cart_items').select('*, products(*)').eq('user_id', user.id);
    setCart(data);
  };

  // Stripe checkout removed
  const handleCheckout = () => {
    alert('Checkout functionality is currently disabled.');
  };

  if (!user) return <div className="text-center my-8">Please login to view cart</div>;

  return (
    <div className="max-w-4xl mx-auto my-8 p-6">
      <h2 className="font-poppins font-bold text-4xl text-black mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="font-open-sans text-gray-500">Cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="flex items-center p-4 bg-gray-100 rounded-lg mb-4">
              <img
                src={item.products.image_url || 'https://via.placeholder.com/192'}
                alt={item.products.name}
                className="w-24 h-24 object-cover mr-4"
              />
              <div className="flex-1">
                <h3 className="font-poppins font-bold text-xl">{item.products.name}</h3>
                <p className="font-open-sans text-gray-500">${item.products.price} x {item.quantity}</p>
              </div>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                className="w-16 p-2 border border-gray-300 rounded"
                min="0"
              />
            </div>
          ))}
          <button
            onClick={handleCheckout}
            className="mt-4 bg-red-500 text-white font-poppins font-bold py-2 px-4 rounded-full hover:bg-red-700"
          >
            Checkout (${cart.reduce((sum, item) => sum + item.quantity * item.products.price, 0).toFixed(2)})
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;