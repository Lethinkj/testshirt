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
      <div className="bg-gradient-to-b from-white to-gray-100 py-8 min-h-screen">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="font-poppins font-extrabold text-5xl md:text-6xl text-black text-center mb-4 drop-shadow-lg">
            Welcome to <span className="text-red-500">7F Tshirt</span>
          </h1>
          <p className="font-open-sans text-gray-600 text-lg md:text-2xl text-center max-w-2xl mx-auto mb-10">
            Discover our premium collection of Polo, Crewneck, and Oversized T-shirts. Shop the latest styles and enjoy exclusive offers!
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <a href="/polo" className="bg-red-500 text-white font-poppins font-bold py-2 px-6 rounded-full shadow hover:bg-red-700 transition">Polo</a>
            <a href="/crewneck" className="bg-blue-500 text-white font-poppins font-bold py-2 px-6 rounded-full shadow hover:bg-blue-700 transition">Crewneck</a>
            <a href="/oversized" className="bg-green-500 text-white font-poppins font-bold py-2 px-6 rounded-full shadow hover:bg-green-700 transition">Oversized</a>
            <a href="/about" className="bg-gray-800 text-white font-poppins font-bold py-2 px-6 rounded-full shadow hover:bg-gray-900 transition">About</a>
            <a href="/contact" className="bg-yellow-500 text-black font-poppins font-bold py-2 px-6 rounded-full shadow hover:bg-yellow-600 transition">Contact</a>
            <a href="/blog" className="bg-purple-500 text-white font-poppins font-bold py-2 px-6 rounded-full shadow hover:bg-purple-700 transition">Blog</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <a
              href="/polo"
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-poppins font-bold py-3 px-10 rounded-full shadow-lg text-xl hover:from-red-700 hover:to-pink-700 transition"
            >
              Start Shopping Now
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;