import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {/* Company Logo */}
              <Link to="/">
                <img
                  className="h-12 w-auto"
                  src="/NSTechno.png"
                  alt="Company Logo"
                />
              </Link>
              {/* Company Name */}
              <span className="ml-3 text-xl font-bold text-gray-800">
                NS TECHNO.
              </span>
            </div>
          </div>
          {/* Navigation Links */}
          <div className="flex items-center">
            <Link
              to="/about"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 