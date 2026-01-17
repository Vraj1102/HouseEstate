import React from "react";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsFacebook, BsInstagram, BsTwitter, BsLinkedin } from "react-icons/bs";
import { FaHome, FaPhone, FaEnvelope } from "react-icons/fa";

export default function Footers() {
  return (
    <Footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/">
              <h1 className="font-bold text-2xl flex items-center space-x-2">
                <FaHome className="text-blue-400" />
                <div>
                  <span className="text-blue-400">House</span>
                  <span className="text-white">Estate</span>
                </div>
              </h1>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted partner in finding the perfect home. We provide premium real estate services with excellence and integrity.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-blue-400">Quick Links</h3>
            <div className="space-y-2">
              <Footer.Link href="/" className="text-gray-300 hover:text-blue-400 transition-colors">Home</Footer.Link>
              <Footer.Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors">About Us</Footer.Link>
              <Footer.Link href="/search" className="text-gray-300 hover:text-blue-400 transition-colors">Properties</Footer.Link>
              <Footer.Link href="/signin" className="text-gray-300 hover:text-blue-400 transition-colors">Sign In</Footer.Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-blue-400">Services</h3>
            <div className="space-y-2">
              <p className="text-gray-300 text-sm">Property Sales</p>
              <p className="text-gray-300 text-sm">Property Rentals</p>
              <p className="text-gray-300 text-sm">Property Management</p>
              <p className="text-gray-300 text-sm">Investment Consulting</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-blue-400">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <FaPhone className="text-blue-400" />
                <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-blue-400" />
                <span className="text-gray-300 text-sm">info@vrgroup.com</span>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-4 pt-2">
              <Footer.Icon 
                href="#" 
                icon={BsFacebook} 
                className="text-gray-300 hover:text-blue-400 transition-colors" 
              />
              <Footer.Icon
                href="#"
                icon={BsInstagram}
                className="text-gray-300 hover:text-pink-400 transition-colors"
              />
              <Footer.Icon 
                href="#" 
                icon={BsTwitter} 
                className="text-gray-300 hover:text-blue-400 transition-colors" 
              />
              <Footer.Icon 
                href="#" 
                icon={BsLinkedin} 
                className="text-gray-300 hover:text-blue-400 transition-colors" 
              />
            </div>
          </div>
        </div>
        
        <Footer.Divider className="border-gray-600 my-6" />
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <Footer.Copyright 
            href="#" 
            by="VR Group" 
            year={new Date().getFullYear()} 
            className="text-gray-300"
          />
          <p className="text-gray-400 text-sm mt-2 sm:mt-0">
            All rights reserved. Built with excellence.
          </p>
        </div>
      </div>
    </Footer>
  );
}
