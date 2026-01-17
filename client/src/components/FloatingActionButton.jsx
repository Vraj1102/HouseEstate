import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaPhone, FaEnvelope, FaWhatsapp, FaPlus, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function FloatingActionButton() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCall = () => {
    window.open('tel:+1234567890', '_self');
  };

  const handleEmail = () => {
    window.open('mailto:info@vrgroup.com', '_self');
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/1234567890?text=Hi, I am interested in your properties', '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className={`flex flex-col space-y-3 mb-4 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover-lift"
            title="Scroll to top"
          >
            <FaArrowUp className="text-lg" />
          </button>
        )}

        <button
          onClick={handleWhatsApp}
          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover-lift"
          title="Chat on WhatsApp"
        >
          <FaWhatsapp className="text-lg" />
        </button>

        <button
          onClick={handleEmail}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover-lift"
          title="Send Email"
        >
          <FaEnvelope className="text-lg" />
        </button>

        <button
          onClick={handleCall}
          className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover-lift"
          title="Call Us"
        >
          <FaPhone className="text-lg" />
        </button>

        {currentUser && (
          <Link
            to="/create-listing"
            className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover-lift flex items-center justify-center"
            title="Create Listing"
          >
            <FaPlus className="text-lg" />
          </Link>
        )}
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover-lift animate-pulse-glow ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
        title="Quick Actions"
      >
        {isOpen ? <FaTimes className="text-xl" /> : <FaPlus className="text-xl" />}
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-4 bg-white rounded-lg shadow-xl p-4 w-64 animate-fade-in">
          <div className="text-sm text-gray-800">
            <h4 className="font-semibold mb-2 text-blue-600">Contact VR Group</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FaPhone className="text-purple-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-blue-500" />
                <span>info@vrgroup.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaWhatsapp className="text-green-500" />
                <span>Chat with us</span>
              </div>
            </div>
          </div>
          <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
        </div>
      )}
    </div>
  );
}