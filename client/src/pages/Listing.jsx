import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";
import Contact from "../components/Contact";

// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className="min-h-screen bg-gray-50">
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="text-xl font-semibold">Something went wrong!</p>
          </div>
        </div>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation className="h-[500px]">
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-full"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button
            onClick={() => navigate(-1)}
            className="fixed top-[13%] left-[3%] z-10 bg-white border rounded-full w-12 h-12 flex justify-center items-center shadow-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <FaArrowLeft className="text-primary-600" />
          </button>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-white shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <FaShare
              className="text-primary-600"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-lg bg-success-500 text-white px-4 py-2 shadow-lg">
              Link copied!
            </p>
          )}
          <div className="max-w-6xl mx-auto p-6 my-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Payment Status Badge */}
              {listing.paymentStatus !== "available" && (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
                  listing.paymentStatus === "sold" 
                    ? "bg-red-100 text-red-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  <FaCheckCircle />
                  <span className="font-semibold">
                    {listing.paymentStatus === "sold" ? "SOLD" : "TOKEN PAID - Reserved"}
                  </span>
                </div>
              )}
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {listing.name}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <FaMapMarkerAlt className="text-primary-600" />
                <p className="text-lg">{listing.address}</p>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary-600">
                  ₹{listing.offer ? listing.discountPrice.toLocaleString('en-IN') : listing.regularPrice.toLocaleString('en-IN')}
                  {listing.type === "rent" && <span className="text-lg text-gray-500"> / month</span>}
                </span>
                {listing.offer && (
                  <span className="bg-success-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    ₹{(listing.regularPrice - listing.discountPrice).toLocaleString('en-IN')} OFF
                  </span>
                )}
              </div>
              <div className="flex gap-3 mb-6">
                <span className={`px-6 py-2 rounded-full text-white font-semibold ${
                  listing.type === "rent" ? "bg-success-600" : "bg-primary-600"
                }`}>
                  For {listing.type === "rent" ? "Rent" : "Sale"}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">{listing.description}</p>
              </div>
              
              {/* Important Information Box */}
              <div className="bg-blue-50 border-l-4 border-primary-600 p-6 mb-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-primary-800 mb-3 flex items-center gap-2">
                  <FaCheckCircle />
                  Important Information
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Property verification completed</li>
                  <li>• All legal documents available</li>
                  <li>• {listing.parking ? "Dedicated parking space included" : "Street parking available"}</li>
                  <li>• {listing.furnished ? "Fully furnished with modern amenities" : "Unfurnished - customize to your taste"}</li>
                  <li>• Property status: <span className="font-semibold">{listing.paymentStatus === "available" ? "Available for booking" : listing.paymentStatus === "token_paid" ? "Reserved - Token paid" : "Sold"}</span></li>
                  {listing.offer && <li>• Special discount offer active - Save ₹{(listing.regularPrice - listing.discountPrice).toLocaleString('en-IN')}!</li>}
                </ul>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <FaBed className="text-3xl text-primary-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-800">{listing.bedrooms} Bedroom{listing.bedrooms > 1 ? 's' : ''}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <FaBath className="text-3xl text-primary-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-800">{listing.bathrooms} Bathroom{listing.bathrooms > 1 ? 's' : ''}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <FaParking className="text-3xl text-primary-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-800">{listing.parking ? "Parking" : "No Parking"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <FaChair className="text-3xl text-primary-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-800">{listing.furnished ? "Furnished" : "Unfurnished"}</p>
                </div>
              </div>
              {currentUser && listing.userRef !== currentUser._id && !contact && listing.paymentStatus === "available" && (
                <div className="flex gap-4">
                  <button
                    onClick={() => setContact(true)}
                    className="flex-1 bg-gray-700 text-white rounded-lg font-semibold py-4 hover:bg-gray-800 transition-colors"
                  >
                    Contact Owner
                  </button>
                  <Link
                    to={`/payment/${listing._id}`}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold py-4 text-center hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg"
                  >
                    Book Now - Pay Token
                  </Link>
                </div>
              )}
              {listing.paymentStatus !== "available" && (
                <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 text-center">
                  <p className="text-lg font-semibold text-gray-700">
                    {listing.paymentStatus === "sold" 
                      ? "This property has been sold" 
                      : "This property is reserved - Token amount paid"}
                  </p>
                </div>
              )}
              {contact && <Contact listing={listing} />}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
