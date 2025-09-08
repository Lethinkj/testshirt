import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../supabaseClient';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    // Optional: Store contact messages in a new table or send via email (e.g., SendGrid)
    alert('Message sent!');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div>
      <Navbar />
      <div className="bg-white py-8">
        <div className="max-w-md mx-auto px-6">
          <h1 className="font-poppins font-bold text-4xl md:text-5xl text-black text-center mb-4">
            Contact Us
          </h1>
          <p className="font-open-sans text-gray-500 text-lg md:text-xl text-center mb-8">
            Have questions? Reach out to us!
          </p>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full p-3 mb-4 border border-gray-300 rounded font-open-sans"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 mb-4 border border-gray-300 rounded font-open-sans"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
              className="w-full p-3 mb-4 border border-gray-300 rounded font-open-sans h-32"
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-red-500 text-white font-poppins font-bold py-2 rounded hover:bg-red-700"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;