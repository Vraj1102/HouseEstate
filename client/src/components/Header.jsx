import React, { useState, useEffect } from "react";
import { FaSearch, FaHome, FaUser, FaSignInAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <FaHome className="text-2xl text-blue-600 group-hover:text-blue-700 transition-colors" />
          <h1 className="font-bold text-xl sm:text-2xl">
            <span className="text-blue-600">House</span>
            <span className="text-gray-800">Estate</span>
          </h1>
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="hidden md:flex bg-gray-50 border border-gray-200 rounded-full px-4 py-2 items-center hover:shadow-md transition-shadow"
        >
          <input
            type="text"
            placeholder="Search properties..."
            className="bg-transparent focus:outline-none w-64 text-gray-700 placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="ml-2">
            <FaSearch className="text-gray-600 hover:text-blue-600 transition-colors" />
          </button>
        </form>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <Link to="/" className="hidden sm:flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium">
            <FaHome className="text-sm" />
            <span>Home</span>
          </Link>
          <Link to="/about" className="hidden sm:flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium">
            <span>About</span>
          </Link>
          
          {currentUser && currentUser.role === "admin" && (
            <Link to="/admin" className="hidden sm:flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors font-medium">
              <span>Admin</span>
            </Link>
          )}
          
          <Link to="/profile">
            {currentUser ? (
              <div className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 rounded-full px-3 py-2 transition-colors">
                <img
                  className="rounded-full h-8 w-8 object-cover border-2 border-blue-200"
                  src={currentUser.avatar}
                  alt="profile"
                />
                <span className="hidden sm:block text-gray-700 font-medium">{currentUser.username}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-colors font-medium">
                <FaSignInAlt className="text-sm" />
                <span>Sign In</span>
              </div>
            )}
          </Link>
        </nav>
      </div>
      
      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-4">
        <form onSubmit={handleSubmit} className="flex bg-gray-50 border border-gray-200 rounded-full px-4 py-2 items-center">
          <input
            type="text"
            placeholder="Search properties..."
            className="bg-transparent focus:outline-none flex-1 text-gray-700 placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch className="text-gray-600" />
          </button>
        </form>
      </div>
    </header>
  );
}
