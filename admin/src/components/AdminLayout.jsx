import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signOutUserStart, signOutUserSuccess } from "../../client/src/redux/user/userSlice";

export default function AdminLayout({ children }) {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      dispatch(signOutUserSuccess(data));
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-slate-800 text-white shadow-md">
        <div className="flex justify-between items-center max-w-7xl mx-auto p-4">
          <Link to="/admin">
            <h1 className="font-bold text-xl">
              <span className="text-blue-400">Admin</span>
              <span className="text-white"> Panel</span>
            </h1>
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {currentUser?.username}</span>
            <Link 
              to="/" 
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
            >
              View Site
            </Link>
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="p-6">
        {children}
      </main>
    </div>
  );
}