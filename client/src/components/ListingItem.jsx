import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaBed, FaBath, FaHeart, FaShare, FaTag } from "react-icons/fa";
import { useState } from "react";

export default function ListingItem({ listing }) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: listing.name,
        text: listing.description,
        url: window.location.origin + `/listing/${listing._id}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/listing/${listing._id}`);
      alert('Link copied to clipboard!');
    }
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
      <Link to={`/listing/${listing._id}`}>
        <div className="relative overflow-hidden">
          {/* Image Loading Skeleton */}
          {!imageLoaded && (
            <div className="h-[220px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
          )}
          
          <img
            src={
              listing.imageUrls[0] ||
              "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
            }
            alt="listing cover"
            className={`h-[220px] w-full object-cover group-hover:scale-110 transition-transform duration-500 ${imageLoaded ? 'block' : 'hidden'}`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Overlay Actions */}
          <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'
              }`}
            >
              <FaHeart className="text-sm" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-blue-500 hover:text-white transition-all duration-200"
            >
              <FaShare className="text-sm" />
            </button>
          </div>
          
          {/* Offer Badge */}
          {listing.offer && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
              <FaTag className="text-xs" />
              <span>Special Offer</span>
            </div>
          )}
          
          {/* Type Badge */}
          <div className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${
            listing.type === 'rent' ? 'bg-green-500' : 'bg-blue-500'
          }`}>
            For {listing.type === 'rent' ? 'Rent' : 'Sale'}
          </div>
        </div>
        
        <div className="p-5 space-y-3">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
            {listing.name}
          </h3>
          
          {/* Location */}
          <div className="flex items-center space-x-2 text-gray-600">
            <MdLocationOn className="text-red-500 flex-shrink-0" />
            <p className="text-sm truncate">{listing.address}</p>
          </div>
          
          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-800">
                ₹{listing.offer
                  ? listing.discountPrice.toLocaleString('en-IN')
                  : listing.regularPrice.toLocaleString('en-IN')}
                {listing.type === "rent" && <span className="text-sm font-normal text-gray-600">/month</span>}
              </p>
              {listing.offer && (
                <p className="text-sm text-gray-500 line-through">
                  ₹{listing.regularPrice.toLocaleString('en-IN')}
                </p>
              )}
            </div>
          </div>
          
          {/* Features */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-1">
                <FaBed className="text-blue-500" />
                <span className="text-sm font-medium">
                  {listing.bedrooms} {listing.bedrooms === 1 ? 'Bed' : 'Beds'}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <FaBath className="text-blue-500" />
                <span className="text-sm font-medium">
                  {listing.bathrooms} {listing.bathrooms === 1 ? 'Bath' : 'Baths'}
                </span>
              </div>
            </div>
            
            {/* Additional Features */}
            <div className="flex space-x-2">
              {listing.furnished && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  Furnished
                </span>
              )}
              {listing.parking && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                  Parking
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
