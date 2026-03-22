import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import "swiper/css/effect-fade";
import ListingItem from "../components/ListingItem";
import { FaSearch, FaHome, FaKey, FaHandshake, FaStar, FaArrowRight, FaArrowUp } from "react-icons/fa";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  SwiperCore.use([Navigation, Autoplay, EffectFade]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=4`);
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (err) {
        console.log(err);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit=4`);
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (err) {
        console.log(err);
      }
    };
    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=sale&limit=4`);
        const data = await res.json();
        setSaleListings(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOfferListings();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnpNNiAzNGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTM2IDM0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 py-24 lg:py-32 relative z-10">
          <div className="text-center space-y-8">
            <div className="inline-block">
              <span className="bg-accent-500 text-white px-6 py-2 rounded-full text-sm font-semibold animate-pulse">
                🏠 Premium Real Estate Platform
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Find Your Dream
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 mt-2">
                Home Today
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover premium properties with HouseEstate - Your trusted partner in finding the perfect place to call home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                to="/search"
                className="group bg-gradient-to-r from-accent-500 to-accent-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-accent-600 hover:to-accent-700 transition-all duration-300 shadow-2xl hover:shadow-accent-500/50 flex items-center space-x-2 transform hover:scale-105"
              >
                <FaSearch />
                <span>Explore Properties</span>
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-primary-900 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
              >
                <span>Learn More</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-accent-600 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4 mt-2">Why Choose HouseEstate?</h2>
            <p className="text-xl text-gray-600">We make your property journey seamless and successful</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center p-8 rounded-2xl bg-white hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary-200 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <FaHome className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Premium Properties</h3>
              <p className="text-gray-600">Curated selection of high-quality homes and commercial spaces</p>
            </div>
            <div className="group text-center p-8 rounded-2xl bg-white hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-success-200 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-success-500 to-success-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <FaKey className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Easy Process</h3>
              <p className="text-gray-600">Streamlined buying and renting process with expert guidance</p>
            </div>
            <div className="group text-center p-8 rounded-2xl bg-white hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-accent-200 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-accent-500 to-accent-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <FaHandshake className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Trusted Service</h3>
              <p className="text-gray-600">Years of experience with thousands of satisfied customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Property Showcase Slider */}
      {offerListings && offerListings.length > 0 && (
        <div className="relative bg-gray-900">
          <Swiper
            navigation
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            effect="fade"
            className="h-[600px]"
          >
            {offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div
                  style={{
                    background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                  className="h-full flex items-center justify-center"
                >
                  <div className="text-center text-white space-y-6 px-6 py-10 bg-black/50 backdrop-blur-md rounded-3xl max-w-2xl mx-4 shadow-2xl border border-white/20">
                    <h3 className="text-3xl md:text-5xl font-bold text-white">
                      {listing.name}
                    </h3>
                    <p className="text-lg md:text-xl text-gray-200">{listing.address}</p>
                    <div className="text-3xl md:text-4xl font-bold text-yellow-400">
                      ₹{listing.regularPrice.toLocaleString('en-IN')}
                      {listing.type === 'rent' && <span className="text-2xl text-gray-300">/month</span>}
                    </div>
                    <Link
                      to={`/listing/${listing._id}`}
                      className="inline-block bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-xl transform hover:scale-105"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Property Sections */}
      <div className="max-w-7xl mx-auto px-4 py-20 space-y-20">
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-2">Special Offers</h2>
                <p className="text-xl text-gray-600">Limited time deals on premium properties</p>
              </div>
              <Link
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center space-x-2"
                to="/search?offer=true"
              >
                <span>View All Offers</span>
                <FaArrowRight />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-2">For Rent</h2>
                <p className="text-xl text-gray-600">Find your perfect rental home</p>
              </div>
              <Link
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center space-x-2"
                to="/search?type=rent"
              >
                <span>View All Rentals</span>
                <FaArrowRight />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-2">For Sale</h2>
                <p className="text-xl text-gray-600">Invest in your dream property</p>
              </div>
              <Link
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2"
                to="/search?type=sale"
              >
                <span>View All Sales</span>
                <FaArrowRight />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-orange-500 via-blue-500 to-slate-700 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnpNNiAzNGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTM2IDM0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of satisfied customers who found their perfect property with HouseEstate
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/search"
              className="bg-white text-primary-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl flex items-center justify-center space-x-2 transform hover:scale-105"
            >
              <FaSearch />
              <span>Browse Properties</span>
            </Link>
            <Link
              to="/signup"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-primary-900 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
            >
              <span>Get Started</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          title="Scroll to top"
        >
          <FaArrowUp className="text-xl" />
        </button>
      )}
    </div>
  );
}
