import { useContext } from 'react';
import { supabase } from '../supabaseClient';
import { AuthContext } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { user } = useContext(AuthContext);

  const addToCart = async () => {
    if (!user) return alert('Please login to add to cart');
    const { error } = await supabase.from('cart_items').insert({
      user_id: user.id,
      product_id: product.id,
      quantity: 1
    });
    if (error) alert(error.message);
    else alert('Added to cart!');
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <img src={product.image_url || 'https://via.placeholder.com/192'} alt={product.name} className="w-full h-48 object-cover mb-4" />
      <h3 className="font-poppins font-bold text-xl text-black">{product.name}</h3>
      <p className="font-open-sans text-gray-500 text-base">{product.description}</p>
      <p className="font-open-sans text-gray-500 text-base">${product.price}</p>
      <p className="font-open-sans text-gray-500 text-base">Stock: {product.quantity}</p>
      <button
        onClick={addToCart}
        className="mt-4 bg-red-500 text-white font-poppins font-bold py-2 px-4 rounded-full hover:bg-red-700"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;