import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="shadow-md sticky top-0 z-50">
      <nav className="bg-gradient-to-r  from-[#011627] to-[#1B3B6F] px-4 lg:px-6 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo.png"
              className="mr-3 h-8"
              alt="Logo"
            />
            <span className="text-xl font-bold text-white">PHYSIOFEEDY</span>
          </Link>

          {/* Toggle Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-white focus:outline-none"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-8 items-center">
            {/* Menu Items */}
            <Link to="/" className="text-gray-300 hover:text-cyan-400 font-semibold transition duration-300">
              Home
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-cyan-400 font-semibold transition duration-300">
              About
            </Link>
            <Link to="/services" className="text-gray-300 hover:text-cyan-400 font-semibold transition duration-300">
              Services
            </Link>
        
        
            <Link to="/contact" className="text-gray-300 hover:text-cyan-400 font-semibold transition duration-300">
              Contact
            </Link>

            {/* Login and Register Buttons */}
            <Link
              to="/login"
              className="text-sm px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-white transition duration-300"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="text-sm px-4 py-2 rounded bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-white font-semibold transition duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-3 bg-[#011627] rounded-lg shadow-md py-2 px-4 text-center space-y-3">
            {/* Mobile Menu Items */}
            <Link to="/" className="block text-gray-300 hover:text-cyan-400 font-semibold transition duration-300">
              Home
            </Link>
            <Link to="/about" className="block text-gray-300 hover:text-cyan-400 font-semibold transition duration-300">
              About
            </Link>
            <Link to="/services" className="block text-gray-300 hover:text-cyan-400 font-semibold transition duration-300">
              Services
            </Link>
            <Link to="/features" className="block text-gray-300 hover:text-cyan-400 font-semibold transition duration-300">
              Features
            </Link>
            <Link to="/team" className="block text-gray-300 hover:text-cyan-400 font-semibold transition duration-300">
              Team
            </Link>
            <Link to="/contact" className="block text-gray-300 hover:text-cyan-400 font-semibold transition duration-300">
              Contact
            </Link>

            {/* Login and Register Buttons Mobile */}
            <Link
              to="/login"
              className="block text-sm mt-2 py-2 px-4 rounded bg-cyan-500 hover:bg-cyan-400 text-white transition duration-300"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="block text-sm py-2 px-4 rounded bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-white font-semibold transition duration-300"
            >
              Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
