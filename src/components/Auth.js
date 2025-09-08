import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = async () => {
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else navigate('/');
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert('Check your email for confirmation');
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="font-poppins font-bold text-3xl text-black mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-3 mb-4 border border-gray-300 rounded font-open-sans"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-3 mb-4 border border-gray-300 rounded font-open-sans"
      />
      <button
        onClick={handleAuth}
        className="w-full bg-red-500 text-white font-poppins font-bold py-2 rounded hover:bg-red-700"
      >
        {isLogin ? 'Login' : 'Sign Up'}
      </button>
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="mt-4 text-red-500 font-open-sans"
      >
        Switch to {isLogin ? 'Sign Up' : 'Login'}
      </button>
    </div>
  );
};

export default Auth;