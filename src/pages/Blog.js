import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Blog = () => (
  <div>
    <Navbar />
    <div className="bg-white py-8">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="font-poppins font-bold text-4xl md:text-5xl text-black text-center mb-4">
          Our Blog
        </h1>
        <p className="font-open-sans text-gray-500 text-lg md:text-xl text-center max-w-2xl mx-auto mb-8">
          Stay updated with the latest fashion trends and news.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="font-poppins font-bold text-xl text-black">Blog Post Title</h3>
            <p className="font-open-sans text-gray-500 text-base">Posted on Sept 8, 2025</p>
            <p className="font-open-sans text-gray-500 text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <a
              href="#"
              className="mt-4 inline-block bg-red-500 text-white font-poppins font-bold py-2 px-4 rounded hover:bg-red-700"
            >
              Read More
            </a>
          </div>
          {/* Add more static or dynamic posts */}
        </div>
        <div className="text-center mt-8">
          <a
            href="#"
            className="bg-red-500 text-white font-poppins font-bold py-2 px-6 rounded-full hover:bg-red-700"
          >
            View All Posts
          </a>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Blog;