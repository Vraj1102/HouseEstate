import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaWhatsapp, FaPlus, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const handleCall = () => {
    window.open('tel:+1234567890', '_self');
  };

  const handleEmail = () => {
    window.open('mailto:info@houseestate.com', '_self');
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/1234567890?text=Hi, I am interested in your properties', '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className={`flex flex-col space-y-3 mb-4 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <button
          onClick={handleWhatsApp}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover-lift"
          title="Chat on WhatsApp"
        >
          <FaWhatsapp className="text-lg" />
        </button>

        <button
          onClick={handleEmail}
          className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover-lift"
          title="Send Email"
        >
          <FaEnvelope className="text-lg" />
        </button>

        <button
          onClick={handleCall}
          className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover-lift"
          title="Call Us"
        >
          <FaPhone className="text-lg" />
        </button>

        {currentUser && (
          <Link
            to="/create-listing"
            className="bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover-lift flex items-center justify-center"
            title="Create Listing"
          >
            <FaPlus className="text-lg" />
          </Link>
        )}
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover-lift ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
        title="Quick Actions"
      >
        {isOpen ? <FaTimes className="text-xl" /> : <FaPlus className="text-xl" />}
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-4 bg-white rounded-lg shadow-xl p-4 w-64 animate-fade-in border border-gray-200">
          <div className="text-sm text-gray-800">
            <h4 className="font-semibold mb-2 text-primary-600">Contact HouseEstate</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FaPhone className="text-accent-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-primary-600" />
                <span>info@houseestate.com</span>
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