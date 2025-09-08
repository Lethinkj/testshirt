import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*').limit(6);
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="font-poppins font-bold text-4xl md:text-5xl text-black text-center mb-4">
            Welcome to 7F Tshirt
          </h1>
          <p className="font-open-sans text-gray-500 text-lg md:text-xl text-center max-w-2xl mx-auto mb-8">
            Discover our premium collection of Polo, Crewneck, and Oversized T-shirts.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href="/polo"
              className="bg-red-500 text-white font-poppins font-bold py-2 px-6 rounded-full hover:bg-red-700"
            >
              Start Shopping
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;