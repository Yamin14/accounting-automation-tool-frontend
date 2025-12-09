import { useState } from "react";
import useAuthStore from "../../store/authStore";
import useAlertStore from "../../store/alertStore";
import api from "../../api/api";
import Spinner from "../Layout/Spinner";
import { ArrowLeft, LogOut, User } from "lucide-react";
import { Link, Navigate } from "react-router";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuthStore();
  const { addAlert } = useAlertStore();

  // not signed in
  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
      logout();
      addAlert("Logged out successfully", "success");
    } catch (error) {
      addAlert("Logout failed", "error");
      return;
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <Spinner />

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5 pointer-events-none"></div>

      <div className="relative max-w-3xl mx-auto bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
            <User className="text-white w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
        </div>

        <div className="bg-white/70 p-6 rounded-2xl border border-gray-100 shadow-md">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Company:</strong> {user.company?.companyName}</p>
          <p><strong>Role:</strong> {user.role}</p>
          {user.role === "accountant" && (
            <p>
              <strong>Approved:</strong>{" "}
              {user.isApproved ? "✅ Yes" : "❌ No"}
            </p>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <Link
            to="/accounts"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <button
            onClick={handleLogout}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile