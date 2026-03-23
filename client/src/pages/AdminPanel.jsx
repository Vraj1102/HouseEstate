// This component is logically part of the admin module
// See /admin folder for admin-specific documentation
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOutUserStart } from "../redux/user/userSlice";
import AdminLayout from "../components/AdminLayout";
import { FaUsers, FaHome, FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";

export default function AdminPanel() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [stats, setStats] = useState({ totalUsers: 0, totalListings: 0, recentUsers: [], recentListings: [] });
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'user', 'listing', 'view'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (currentUser?.role === "admin") {
      fetchDashboard();
      fetchUsers();
      fetchListings();
    }
  }, [currentUser]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchListings = async () => {
    try {
      const res = await fetch("/api/admin/listings");
      const data = await res.json();
      if (res.ok) setListings(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/admin/users/${editingItem._id}` : "/api/admin/users";
      const method = editingItem ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        fetchUsers();
        closeModal();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleListingSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/admin/listings/${editingItem._id}` : "/api/admin/listings";
      const method = editingItem ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        fetchListings();
        closeModal();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Delete user and all their listings?")) {
      try {
        const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
        if (res.ok) fetchUsers();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const deleteListing = async (listingId) => {
    if (window.confirm("Delete this listing?")) {
      try {
        const res = await fetch(`/api/admin/listings/${listingId}`, { method: "DELETE" });
        if (res.ok) fetchListings();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      setFormData({
        ...item,
        joinDate: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : '',
        ownerName: item.userRef?.username || item.userRef?.email || ''
      });
    } else {
      setFormData(type === 'user' 
        ? { username: '', email: '', password: '', avatar: '', joinDate: new Date().toISOString().split('T')[0] } 
        : { name: '', description: '', address: '', regularPrice: '', discountPrice: '', bathrooms: 1, bedrooms: 1, furnished: false, parking: false, type: 'rent', offer: false, imageUrls: [''], ownerName: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setEditingItem(null);
    setFormData({});
  };

  if (currentUser?.role !== "admin") {
    return <div className="text-center p-8">Access Denied</div>;
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="text-sm text-gray-600">
            Welcome back, <span className="font-semibold">{currentUser.username}</span>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-200 p-1 rounded-lg">
          {["dashboard", "users", "listings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === tab 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab === 'dashboard' && <FaHome className="inline mr-2" />}
              {tab === 'users' && <FaUsers className="inline mr-2" />}
              {tab === 'listings' && <FaHome className="inline mr-2" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold opacity-90">Total Users</h3>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <FaUsers className="text-4xl opacity-80" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold opacity-90">Total Listings</h3>
                    <p className="text-3xl font-bold">{stats.totalListings}</p>
                  </div>
                  <FaHome className="text-4xl opacity-80" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold opacity-90">Recent Users</h3>
                    <p className="text-3xl font-bold">{stats.recentUsers?.length || 0}</p>
                  </div>
                  <FaUsers className="text-4xl opacity-80" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold opacity-90">Recent Listings</h3>
                    <p className="text-3xl font-bold">{stats.recentListings?.length || 0}</p>
                  </div>
                  <FaHome className="text-4xl opacity-80" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Users</h3>
                <div className="space-y-3">
                  {stats.recentUsers?.slice(0, 5).map((user) => (
                    <div key={user._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-medium text-gray-800">{user.username}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Listings</h3>
                <div className="space-y-3">
                  {stats.recentListings?.slice(0, 5).map((listing) => (
                    <div key={listing._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img src={listing.imageUrls[0]} alt={listing.name} className="w-12 h-10 rounded object-cover" />
                      <div>
                        <p className="font-medium text-gray-800">{listing.name}</p>
                        <p className="text-sm text-gray-600">₹{listing.regularPrice.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === "users" && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">User Management</h2>
              <button
                onClick={() => openModal('user')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <FaPlus /> <span>Add User</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Joined</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full mr-3" />
                          <span className="font-medium text-gray-900">{user.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{user.email}</td>
                      <td className="px-6 py-4 text-gray-700">{user.joinDate ? new Date(user.joinDate).toLocaleDateString('en-IN') : (user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : 'N/A')}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal('view', user)}
                            className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => openModal('user', user)}
                            className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Listings */}
        {activeTab === "listings" && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Property Management</h2>
              <button
                onClick={() => openModal('listing')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <FaPlus /> <span>Add Property</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Property</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Owner</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {listings.map((listing) => (
                    <tr key={listing._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img src={listing.imageUrls[0]} alt={listing.name} className="w-16 h-12 rounded object-cover mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">{listing.name}</p>
                            <p className="text-sm text-gray-600">{listing.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          listing.type === 'rent' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {listing.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">₹{listing.regularPrice.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4 text-gray-700">{listing.ownerName || listing.userRef?.username || listing.userRef?.email || 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal('view', listing)}
                            className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-200 transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => openModal('listing', listing)}
                            className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Edit Property"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={async () => {
                              const newPrice = prompt('Enter new price:', listing.regularPrice);
                              if (newPrice && !isNaN(newPrice)) {
                                try {
                                  const res = await fetch(`/api/admin/listings/${listing._id}`, {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ ...listing, regularPrice: parseInt(newPrice) })
                                  });
                                  if (res.ok) {
                                    fetchListings();
                                    alert('Price updated successfully!');
                                  }
                                } catch (error) {
                                  console.error("Error:", error);
                                }
                              }
                            }}
                            className="bg-yellow-100 text-yellow-700 p-2 rounded-lg hover:bg-yellow-200 transition-colors"
                            title="Quick Price Update"
                          >
                            ₹
                          </button>
                          <button
                            onClick={() => deleteListing(listing._id)}
                            className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200 transition-colors"
                            title="Delete Property"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {modalType === 'view' ? 'View Details' : 
                   editingItem ? `Edit ${modalType}` : `Add ${modalType}`}
                </h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>

              {modalType === 'user' && (
                <form onSubmit={handleUserSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Username"
                    value={formData.username || ''}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                  {!editingItem && (
                    <input
                      type="password"
                      placeholder="Password"
                      value={formData.password || ''}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                  )}
                  <input
                    type="url"
                    placeholder="Avatar URL"
                    value={formData.avatar || ''}
                    onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                    <input
                      type="date"
                      value={formData.joinDate || ''}
                      onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                      {editingItem ? 'Update' : 'Create'}
                    </button>
                    <button type="button" onClick={closeModal} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'listing' && (
                <form onSubmit={handleListingSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Property Name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Owner</label>
                    <input
                      type="text"
                      placeholder="Owner Name or Email"
                      value={formData.ownerName || ''}
                      onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                  </div>
                  <textarea
                    placeholder="Description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-3 border rounded-lg h-24"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Regular Price"
                      value={formData.regularPrice || ''}
                      onChange={(e) => setFormData({...formData, regularPrice: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Discount Price"
                      value={formData.discountPrice || ''}
                      onChange={(e) => setFormData({...formData, discountPrice: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Bedrooms"
                      value={formData.bedrooms || 1}
                      onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      min="1"
                    />
                    <input
                      type="number"
                      placeholder="Bathrooms"
                      value={formData.bathrooms || 1}
                      onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      min="1"
                    />
                  </div>
                  <select
                    value={formData.type || 'rent'}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="rent">Rent</option>
                    <option value="sale">Sale</option>
                  </select>
                  
                  {/* Dynamic Image Management */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Property Images</label>
                    {(formData.imageUrls || ['']).map((url, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="url"
                          placeholder={`Image URL ${index + 1}`}
                          value={url}
                          onChange={(e) => {
                            const newUrls = [...(formData.imageUrls || [''])];
                            newUrls[index] = e.target.value;
                            setFormData({...formData, imageUrls: newUrls});
                          }}
                          className="flex-1 p-3 border rounded-lg"
                          required={index === 0}
                        />
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newUrls = formData.imageUrls.filter((_, i) => i !== index);
                              setFormData({...formData, imageUrls: newUrls});
                            }}
                            className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newUrls = [...(formData.imageUrls || ['']), ''];
                        setFormData({...formData, imageUrls: newUrls});
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      Add Image
                    </button>
                  </div>

                  {/* Additional Property Features */}
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.furnished || false}
                        onChange={(e) => setFormData({...formData, furnished: e.target.checked})}
                        className="rounded"
                      />
                      <span>Furnished</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.parking || false}
                        onChange={(e) => setFormData({...formData, parking: e.target.checked})}
                        className="rounded"
                      />
                      <span>Parking Available</span>
                    </label>
                  </div>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.offer || false}
                      onChange={(e) => setFormData({...formData, offer: e.target.checked})}
                      className="rounded"
                    />
                    <span>Special Offer</span>
                  </label>

                  {/* Real-time Update Buttons */}
                  <div className="flex space-x-3">
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                      {editingItem ? 'Update Property' : 'Create Property'}
                    </button>
                    {editingItem && (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const res = await fetch(`/api/admin/listings/${editingItem._id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(formData)
                            });
                            if (res.ok) {
                              fetchListings();
                              alert('Property updated successfully!');
                            }
                          } catch (error) {
                            console.error("Error:", error);
                          }
                        }}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    )}
                    <button type="button" onClick={closeModal} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'view' && editingItem && (
                <div className="space-y-4">
                  {editingItem.username ? (
                    // User view
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4">
                        <img src={editingItem.avatar} alt={editingItem.username} className="w-16 h-16 rounded-full" />
                        <div>
                          <h4 className="text-xl font-semibold">{editingItem.username}</h4>
                          <p className="text-gray-600">{editingItem.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>User ID:</strong> {editingItem._id}</div>
                        <div><strong>Joined:</strong> {new Date(editingItem.createdAt).toLocaleDateString()}</div>
                        <div><strong>Role:</strong> {editingItem.role || 'user'}</div>
                        <div><strong>Status:</strong> Active</div>
                      </div>
                    </div>
                  ) : (
                    // Listing view
                    <div className="space-y-4">
                      {/* Image Gallery */}
                      <div className="grid grid-cols-2 gap-2">
                        {editingItem.imageUrls?.map((url, index) => (
                          <div key={index} className="relative">
                            <img src={url} alt={`${editingItem.name} ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                            <button
                              onClick={async () => {
                                if (window.confirm('Remove this image?')) {
                                  const newUrls = editingItem.imageUrls.filter((_, i) => i !== index);
                                  try {
                                    const res = await fetch(`/api/admin/listings/${editingItem._id}`, {
                                      method: "PUT",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ ...editingItem, imageUrls: newUrls })
                                    });
                                    if (res.ok) {
                                      fetchListings();
                                      setEditingItem({ ...editingItem, imageUrls: newUrls });
                                      alert('Image removed successfully!');
                                    }
                                  } catch (error) {
                                    console.error("Error:", error);
                                  }
                                }
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      {/* Add New Image */}
                      <div className="flex space-x-2">
                        <input
                          type="url"
                          placeholder="Add new image URL"
                          className="flex-1 p-2 border rounded"
                          onKeyPress={async (e) => {
                            if (e.key === 'Enter' && e.target.value) {
                              const newUrls = [...(editingItem.imageUrls || []), e.target.value];
                              try {
                                const res = await fetch(`/api/admin/listings/${editingItem._id}`, {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ ...editingItem, imageUrls: newUrls })
                                });
                                if (res.ok) {
                                  fetchListings();
                                  setEditingItem({ ...editingItem, imageUrls: newUrls });
                                  e.target.value = '';
                                  alert('Image added successfully!');
                                }
                              } catch (error) {
                                console.error("Error:", error);
                              }
                            }
                          }}
                        />
                        <span className="text-sm text-gray-500 self-center">Press Enter to add</span>
                      </div>

                      <h4 className="text-xl font-semibold">{editingItem.name}</h4>
                      <p className="text-gray-600">{editingItem.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Address:</strong> {editingItem.address}</div>
                        <div><strong>Type:</strong> {editingItem.type}</div>
                        <div><strong>Price:</strong> ₹{editingItem.regularPrice?.toLocaleString('en-IN')}</div>
                        <div><strong>Discount:</strong> ₹{editingItem.discountPrice?.toLocaleString('en-IN') || 'None'}</div>
                        <div><strong>Bedrooms:</strong> {editingItem.bedrooms}</div>
                        <div><strong>Bathrooms:</strong> {editingItem.bathrooms}</div>
                        <div><strong>Furnished:</strong> {editingItem.furnished ? 'Yes' : 'No'}</div>
                        <div><strong>Parking:</strong> {editingItem.parking ? 'Yes' : 'No'}</div>
                        <div><strong>Special Offer:</strong> {editingItem.offer ? 'Yes' : 'No'}</div>
                        <div><strong>Owner:</strong> {editingItem.userRef?.username || editingItem.userRef?.email || 'Unknown'}</div>
                        <div><strong>Owner Email:</strong> {editingItem.userRef?.email || 'N/A'}</div>
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="flex space-x-2 pt-4 border-t">
                        <button
                          onClick={() => {
                            setModalType('listing');
                            setFormData(editingItem);
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Edit Full Details
                        </button>
                        <button
                          onClick={async () => {
                            const newStatus = editingItem.offer ? false : true;
                            try {
                              const res = await fetch(`/api/admin/listings/${editingItem._id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ ...editingItem, offer: newStatus })
                              });
                              if (res.ok) {
                                fetchListings();
                                setEditingItem({ ...editingItem, offer: newStatus });
                                alert(`Offer ${newStatus ? 'enabled' : 'disabled'} successfully!`);
                              }
                            } catch (error) {
                              console.error("Error:", error);
                            }
                          }}
                          className={`px-4 py-2 rounded text-white ${
                            editingItem.offer ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          {editingItem.offer ? 'Disable Offer' : 'Enable Offer'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}