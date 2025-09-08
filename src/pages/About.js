import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => (
  <div>
    <Navbar />
    <div className="bg-white py-8">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="font-poppins font-bold text-4xl md:text-5xl text-black text-center mb-4">
          About Us
        </h1>
        <p className="font-open-sans text-gray-500 text-lg md:text-xl text-center max-w-2xl mx-auto mb-8">
          7F Tshirt is dedicated to providing high-quality, stylish T-shirts for every occasion.
          Learn more about our mission and values.
        </p>
        <div className="text-center">
          <a
            href="/contact"
            className="bg-red-500 text-white font-poppins font-bold py-2 px-6 rounded-full hover:bg-red-700"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default About;