import { useEffect, useState, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminDashboard = () => {
  const { role, fetchRole } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (role !== 'admin') return;

    const fetchData = async () => {
      const { data: usersData } = await supabase.from('profiles').select('*');
      const { data: productsData } = await supabase.from('products').select('*');
      const { data: ordersData } = await supabase.from('orders').select('*, products(name), profiles(email)');
      setUsers(usersData);
      setProducts(productsData);
      setOrders(ordersData);
    };
    fetchData();
  }, [role]);

  const promoteToManager = async (userId) => {
    await supabase.from('profiles').update({ role: 'manager' }).eq('id', userId);
    fetchRole(userId);
    setUsers(users.map(u => u.id === userId ? { ...u, role: 'manager' } : u));
  };

  const deleteProduct = async (productId) => {
    await supabase.from('products').delete().eq('id', productId);
    setProducts(products.filter(p => p.id !== productId));
  };

  if (role !== 'admin') return <div className="text-center my-8">Access Denied</div>;

  return (
    <div>
      <Navbar />
      <div className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="font-poppins font-bold text-4xl md:text-5xl text-black text-center mb-4">
            Admin Dashboard
          </h1>
          <h2 className="font-poppins font-bold text-2xl text-black mb-4">Users</h2>
          <div className="grid grid-cols-1 gap-4 mb-8">
            {users.map(user => (
              <div key={user.id} className="bg-gray-100 p-4 rounded-lg flex justify-between">
                <span>{user.email} ({user.role})</span>
                {user.role !== 'admin' && (
                  <button
                    onClick={() => promoteToManager(user.id)}
                    className="bg-red-500 text-white font-poppins font-bold py-1 px-3 rounded hover:bg-red-700"
                  >
                    Make Manager
                  </button>
                )}
              </div>
            ))}
          </div>
          <h2 className="font-poppins font-bold text-2xl text-black mb-4">Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {products.map(product => (
              <div key={product.id} className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-poppins font-bold text-xl">{product.name}</h3>
                <p className="font-open-sans text-gray-500">${product.price} - {product.quantity} in stock</p>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="mt-2 bg-red-500 text-white font-poppins font-bold py-1 px-3 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <h2 className="font-poppins font-bold text-2xl text-black mb-4">Orders</h2>
          <div className="grid grid-cols-1 gap-4">
            {orders.map(order => (
              <div key={order.id} className="bg-gray-100 p-4 rounded-lg">
                <p className="font-open-sans text-gray-500">
                  Order #{order.id} by {order.profiles.email}: {order.products.name} x {order.quantity} (${order.total_price})
                </p>
                <p className="font-open-sans text-gray-500">Status: {order.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;