import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

//4.03.27 video timestamp

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [purchasedProperties, setPurchasedProperties] = useState([]);
  const [showPurchased, setShowPurchased] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteOTP, setDeleteOTP] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [displayDeleteOTP, setDisplayDeleteOTP] = useState('');

  useEffect(() => {
    if (file) {
      setFileUploadError(false);
      setFilePerc(0);
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    // Fetch purchased properties on mount to check if button should be shown
    const fetchPurchased = async () => {
      try {
        const res = await fetch('/api/payment/user');
        const data = await res.json();
        if (res.ok && data.length > 0) {
          setPurchasedProperties(data);
        }
      } catch (error) {
        console.error('Error fetching purchased properties:', error);
      }
    };
    fetchPurchased();
  }, []);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    if (e.target.id !== 'password') {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match!');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters!');
      return;
    }

    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();
      if (data.success === false) {
        setPasswordError(data.message);
        return;
      }

      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordChange(false);
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (error) {
      setPasswordError(error.message);
    }
  };

  const handleSendDeleteOTP = async () => {
    try {
      const res = await fetch(`/api/user/send-delete-otp/${currentUser._id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        if (data.otp) {
          setDisplayDeleteOTP(data.otp);
        }
      } else {
        alert(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      alert('Error sending OTP');
    }
  };

  const handleVerifyAndDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/verify-delete-otp/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: deleteOTP }),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        alert(data.message || 'Invalid OTP');
        return;
      }
      dispatch(deleteUserSuccess(data));
      navigate('/');
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
      alert('Error deleting account');
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (err) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleShowPurchased = async () => {
    try {
      const res = await fetch('/api/payment/user');
      const data = await res.json();
      if (res.ok && data.length > 0) {
        setPurchasedProperties(data);
        setShowPurchased(!showPurchased);
      }
    } catch (error) {
      console.error('Error fetching purchased properties:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mb-6 transition-colors"
        >
          <span>← Back to Home</span>
        </button>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-8 py-12 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
            <p className="text-primary-100">Manage your account and listings</p>
          </div>

          {/* Profile Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center">
                <input
                  onChange={(e) => setFile(e.target.files[0])}
                  type="file"
                  ref={fileRef}
                  hidden
                  accept="image/*"
                />
                <div className="relative group">
                  <img
                    src={formData.avatar || currentUser.avatar}
                    alt="profile"
                    className="rounded-full h-32 w-32 object-cover border-4 border-primary-200"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current.click()}
                  className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  Change Photo
                </button>
                <p className="text-sm mt-3">
                  {fileUploadError ? (
                    <span className="text-red-600 bg-red-50 px-4 py-2 rounded-lg">Error: Image must be less than 2 MB</span>
                  ) : filePerc > 0 && filePerc < 100 ? (
                    <span className="text-primary-600 bg-primary-50 px-4 py-2 rounded-lg">Uploading {filePerc}%</span>
                  ) : filePerc === 100 ? (
                    <span className="text-success-600 bg-success-50 px-4 py-2 rounded-lg">Image Successfully Uploaded!</span>
                  ) : (
                    ""
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    placeholder="username"
                    defaultValue={currentUser.username}
                    id="username"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="email"
                    defaultValue={currentUser.email}
                    id="email"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Change Password</label>
                {!showPasswordChange ? (
                  <button
                    type="button"
                    onClick={() => setShowPasswordChange(true)}
                    className="w-full border-2 border-primary-600 text-primary-600 p-3 rounded-lg hover:bg-primary-50 transition-colors font-semibold"
                  >
                    Change Password
                  </button>
                ) : (
                  <div className="space-y-3 border-2 border-primary-200 p-4 rounded-lg bg-primary-50">
                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handlePasswordChange}
                        className="flex-1 bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700"
                      >
                        Update Password
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordChange(false);
                          setNewPassword('');
                          setConfirmPassword('');
                          setPasswordError('');
                        }}
                        className="flex-1 bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                    {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg p-3 font-semibold hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 transition-all"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
                <Link
                  className="flex-1 bg-gradient-to-r from-success-600 to-success-700 text-white p-3 rounded-lg text-center font-semibold hover:from-success-700 hover:to-success-800 transition-all"
                  to="/create-listing"
                >
                  Create Listing
                </Link>
              </div>
            </form>

            {error && <p className="text-red-600 bg-red-50 p-3 rounded-lg mt-4">{error}</p>}
            {updateSuccess && <p className="text-success-600 bg-success-50 p-3 rounded-lg mt-4">Profile Updated Successfully!</p>}
            {passwordSuccess && <p className="text-success-600 bg-success-50 p-3 rounded-lg mt-4">Password Changed Successfully!</p>}

            <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
              <button 
                onClick={() => setShowDeleteModal(true)} 
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Delete Account
              </button>
              <button onClick={handleSignOut} className="text-red-600 hover:text-red-700 font-medium">
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleShowListings}
            className="w-full bg-white text-primary-600 border-2 border-primary-600 rounded-lg p-4 font-semibold hover:bg-primary-50 transition-colors"
          >
            {userListings.length > 0 ? 'Refresh My Listings' : 'Show My Listings'}
          </button>
          {purchasedProperties.length > 0 && (
            <button
              onClick={handleShowPurchased}
              className="w-full bg-white text-success-600 border-2 border-success-600 rounded-lg p-4 font-semibold hover:bg-success-50 transition-colors"
            >
              {showPurchased ? 'Hide Purchased' : 'Show Purchased Properties'}
            </button>
          )}
        </div>

        {userListings && userListings.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Listings</h2>
            <div className="grid grid-cols-1 gap-4">
              {userListings.map((listing) => (
                <div
                  key={listing._id}
                  className="border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:shadow-lg transition-shadow"
                >
                  <Link to={`/listing/${listing._id}`}>
                    <img
                      src={listing.imageUrls[0]}
                      alt="listing cover"
                      className="h-24 w-24 object-cover rounded-lg"
                    />
                  </Link>
                  <Link
                    className="flex-1"
                    to={`/listing/${listing._id}`}
                  >
                    <p className="font-semibold text-lg text-gray-800 hover:text-primary-600 transition-colors">{listing.name}</p>
                    <p className="text-gray-500 text-sm">{listing.address}</p>
                    <p className="text-primary-600 font-bold mt-1">${listing.regularPrice.toLocaleString()}</p>
                  </Link>
                  <div className="flex gap-2">
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleListingDelete(listing._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Purchased Properties Section */}
        {showPurchased && purchasedProperties && purchasedProperties.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Purchased Properties</h2>
            <div className="grid grid-cols-1 gap-6">
              {purchasedProperties.map((payment) => (
                <div
                  key={payment._id}
                  className="border-2 border-success-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-success-50"
                >
                  <div className="flex items-start gap-4">
                    <Link to={`/listing/${payment.listingId._id}`}>
                      <img
                        src={payment.listingId.imageUrls[0]}
                        alt="property"
                        className="h-32 w-32 object-cover rounded-lg"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link to={`/listing/${payment.listingId._id}`}>
                        <h3 className="font-bold text-xl text-gray-800 hover:text-primary-600 transition-colors mb-2">
                          {payment.listingId.name}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mb-2">{payment.listingId.address}</p>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-sm text-gray-500">Property Price</p>
                          <p className="font-bold text-lg text-gray-800">${payment.listingId.regularPrice.toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-sm text-gray-500">Amount Paid</p>
                          <p className="font-bold text-lg text-success-600">${payment.amount.toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-sm text-gray-500">Payment Type</p>
                          <p className="font-semibold text-gray-800 capitalize">{payment.paymentType === 'token' ? 'Token (10%)' : 'Booking (20%)'}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-sm text-gray-500">Transaction ID</p>
                          <p className="font-mono text-xs text-gray-600">{payment.transactionId.substring(0, 20)}...</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-sm text-gray-500">Payment Date</p>
                          <p className="font-semibold text-gray-800">{new Date(payment.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-sm text-gray-500">Status</p>
                          <span className="inline-block px-3 py-1 bg-success-500 text-white rounded-full text-sm font-semibold">
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Delete Account</h2>
            <p className="text-gray-600 mb-6">
              {!otpSent 
                ? 'Are you sure you want to delete your account? This action cannot be undone. We will send an OTP to your email for verification.'
                : 'Enter the OTP sent to your email to confirm account deletion.'}
            </p>
            {!otpSent ? (
              <div className="flex gap-3">
                <button
                  onClick={handleSendDeleteOTP}
                  className="flex-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 font-semibold"
                >
                  Send OTP
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 font-semibold"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {displayDeleteOTP && (
                  <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 font-semibold mb-2">Development Mode - Your OTP:</p>
                    <p className="text-3xl font-bold text-yellow-900 text-center tracking-widest">{displayDeleteOTP}</p>
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={deleteOTP}
                  onChange={(e) => setDeleteOTP(e.target.value)}
                  maxLength="6"
                  className="w-full border border-gray-300 p-3 rounded-lg text-center text-2xl tracking-widest"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleVerifyAndDelete}
                    disabled={deleteOTP.length !== 6}
                    className="flex-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 font-semibold disabled:opacity-50"
                  >
                    Verify & Delete
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setOtpSent(false);
                      setDeleteOTP('');
                    }}
                    className="flex-1 bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
