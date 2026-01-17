import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOutUserStart } from "../../../client/src/redux/user/userSlice";
import AdminLayout from "../components/AdminLayout";

export default function AdminPanel() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [stats, setStats] = useState({ totalUsers: 0, totalListings: 0, recentUsers: [], recentListings: [] });
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");

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

  if (currentUser?.role !== "admin") {
    return <div className="text-center p-8">Access Denied</div>;
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
        
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          {["dashboard", "users", "listings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Total Listings</h3>
              <p className="text-3xl font-bold text-green-600">{stats.totalListings}</p>
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === "users" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Joined</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full mr-3" />
                        {user.username}
                      </div>
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Listings */}
        {activeTab === "listings" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Property</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Price</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing._id} className="border-t">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img src={listing.imageUrls[0]} alt={listing.name} className="w-16 h-12 rounded mr-3" />
                        <div>
                          <p className="font-medium">{listing.name}</p>
                          <p className="text-sm text-gray-500">{listing.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-sm ${listing.type === 'rent' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {listing.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">${listing.regularPrice.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteListing(listing._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}