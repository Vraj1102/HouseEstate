import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import StripePaymentForm from "../components/StripePaymentForm";

export default function Payment() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [paymentType, setPaymentType] = useState("token");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [listingId]);

  const fetchListing = async () => {
    try {
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (res.ok) setListing(data);
    } catch (error) {
      console.error(error);
    }
  };

  const calculateAmount = () => {
    if (!listing) return 0;
    if (paymentType === "token") {
      return listing.regularPrice * 0.1;
    }
    return listing.regularPrice * 0.2;
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <FaCheckCircle className="text-6xl text-success-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your booking has been confirmed.</p>
          <p className="text-sm text-gray-500">Redirecting to profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mb-6 transition-colors"
        >
          <FaArrowLeft />
          <span>Back to Property</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Property Details</h2>
            {listing && (
              <div>
                <img src={listing.imageUrls[0]} alt={listing.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="font-bold text-lg">{listing.name}</h3>
                <p className="text-gray-600 mb-2">{listing.address}</p>
                <p className="text-2xl font-bold text-primary-600">${listing.regularPrice.toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>

            {/* Payment Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Payment Type</label>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentType"
                    value="token"
                    checked={paymentType === "token"}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Token Amount (10%)</p>
                    <p className="text-sm text-gray-500">${listing && (listing.regularPrice * 0.1).toLocaleString()}</p>
                  </div>
                </label>
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentType"
                    value="booking"
                    checked={paymentType === "booking"}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Booking Amount (20%)</p>
                    <p className="text-sm text-gray-500">${listing && (listing.regularPrice * 0.2).toLocaleString()}</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Stripe Payment Form */}
            <StripePaymentForm
              amount={calculateAmount()}
              listingId={listingId}
              paymentType={paymentType}
              onSuccess={() => setSuccess(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}