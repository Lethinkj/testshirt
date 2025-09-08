import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Polo from './pages/Polo';
import Crewneck from './pages/Crewneck';
import Oversized from './pages/Oversized';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Auth from './components/Auth';
import Cart from './components/Cart';
import AdminDashboard from './pages/AdminDashboard';

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/polo" element={<Polo />} />
        <Route path="/crewneck" element={<Crewneck />} />
        <Route path="/oversized" element={<Oversized />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;