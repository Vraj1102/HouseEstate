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
    <header className="bg-gradient-to-r from-primary-900 to-primary-800 shadow-lg">
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Logo - Far Left */}
            <Link to="/" className="flex items-center space-x-2 group justify-start">
              <FaHome className="text-2xl text-accent-500 group-hover:text-accent-600 transition-colors" />
              <h1 className="font-bold text-xl sm:text-2xl whitespace-nowrap">
                <span className="text-white">House</span>
                <span className="text-accent-500">Estate</span>
              </h1>
            </Link>

            {/* Search Bar - Center */}
            <form
              onSubmit={handleSubmit}
              className="hidden md:flex bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 items-center hover:bg-white/20 transition-all justify-center"
            >
              <input
                type="text"
                placeholder="Search properties..."
                className="bg-transparent focus:outline-none w-full text-white placeholder-white/70"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="ml-2 flex-shrink-0">
                <FaSearch className="text-white hover:text-accent-500 transition-colors" />
              </button>
            </form>

            {/* Navigation - Far Right */}
            <nav className="flex items-center space-x-4 lg:space-x-6 justify-end">
          <Link to="/" className="hidden sm:flex items-center space-x-1 text-white hover:text-accent-500 transition-colors font-medium">
            <FaHome className="text-sm" />
            <span>Home</span>
          </Link>
          <Link to="/about" className="hidden sm:flex items-center space-x-1 text-white hover:text-accent-500 transition-colors font-medium">
            <span>About</span>
          </Link>
          
          {currentUser && currentUser.role === "admin" && (
            <Link to="/admin" className="hidden sm:flex items-center space-x-1 text-white hover:text-red-400 transition-colors font-medium">
              <span>Admin</span>
            </Link>
          )}
          
          <Link to="/profile">
            {currentUser ? (
              <div className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-full px-3 py-2 transition-colors border border-white/20">
                <img
                  className="rounded-full h-8 w-8 object-cover border-2 border-accent-500"
                  src={currentUser.avatar}
                  alt="profile"
                />
                <span className="hidden sm:block text-white font-medium">{currentUser.username}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 bg-accent-600 hover:bg-accent-500 text-white px-4 py-2 rounded-full transition-colors font-medium">
                <FaSignInAlt className="text-sm" />
                <span>Sign In</span>
              </div>
            )}
          </Link>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-4">
        <form onSubmit={handleSubmit} className="flex bg-white/10 border border-white/20 rounded-full px-4 py-2 items-center">
          <input
            type="text"
            placeholder="Search properties..."
            className="bg-transparent focus:outline-none flex-1 text-white placeholder-white/70"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch className="text-white" />
          </button>
        </form>
      </div>
    </header>
  );
}
