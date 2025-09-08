import { useState, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { AuthContext } from '../context/AuthContext';

const AddProduct = ({ category }) => {
  const { user, role } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  if (!['manager', 'admin'].includes(role)) return null;

  const handleAdd = async () => {
    let imageUrl = null;
    if (image) {
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(`${Date.now()}_${image.name}`, image);
      if (error) return alert(error.message);
      imageUrl = supabase.storage.from('product-images').getPublicUrl(data.path).data.publicUrl;
    }

    const { error } = await supabase.from('products').insert({
      name,
      price,
      quantity,
      description,
      category,
      image_url: imageUrl,
      created_by: user.id
    });
    if (error) alert(error.message);
    else {
      alert('Product added!');
      setName('');
      setPrice('');
      setQuantity('');
      setDescription('');
      setImage(null);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="font-poppins font-bold text-2xl text-black mb-4">Add {category} Product</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="w-full p-3 mb-4 border border-gray-300 rounded font-open-sans"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        className="w-full p-3 mb-4 border border-gray-300 rounded font-open-sans"
      />
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Quantity"
        className="w-full p-3 mb-4 border border-gray-300 rounded font-open-sans"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full p-3 mb-4 border border-gray-300 rounded font-open-sans"
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        accept="image/*"
        className="w-full mb-4"
      />
      <button
        onClick={handleAdd}
        className="w-full bg-red-500 text-white font-poppins font-bold py-2 rounded hover:bg-red-700"
      >
        Add Product
      </button>
    </div>
  );
};

export default AddProduct;