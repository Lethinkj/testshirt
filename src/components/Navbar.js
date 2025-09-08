import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, role } = useContext(AuthContext);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (user) {
      const fetchCartCount = async () => {
        const { data } = await supabase.from('cart_items').select('id').eq('user_id', user.id);
        setCartCount(data.length);
      };
      fetchCartCount();
      const channel = supabase.channel('cart-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'cart_items', filter: `user_id=eq.${user.id}` }, fetchCartCount)
        .subscribe();
      return () => supabase.removeChannel(channel);
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-black text-white py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold font-poppins">7F Tshirt</Link>
      <div className="flex space-x-4">
        <Link to="/" className="hover:text-red-500">Home</Link>
        <Link to="/polo" className="hover:text-red-500">Polo</Link>
        <Link to="/crewneck" className="hover:text-red-500">Crewneck</Link>
        <Link to="/oversized" className="hover:text-red-500">Oversized</Link>
        <Link to="/about" className="hover:text-red-500">About</Link>
        <Link to="/contact" className="hover:text-red-500">Contact</Link>
        <Link to="/blog" className="hover:text-red-500">Blog</Link>
        {user && <Link to="/cart" className="hover:text-red-500">Cart ({cartCount})</Link>}
        {role === 'admin' && <Link to="/admin" className="hover:text-red-500">Admin</Link>}
        {user ? (
          <button onClick={handleLogout} className="hover:text-red-500">Logout</button>
        ) : (
          <Link to="/auth" className="hover:text-red-500">Login/Signup</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;