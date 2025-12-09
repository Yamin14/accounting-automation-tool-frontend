import { useState, useEffect } from 'react';
import { Check, Users, X, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Spinner from '../Layout/Spinner';
import useAlertStore from '../../store/alertStore';
import api from '../../api/api';

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addAlert } = useAlertStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data.users);
      addAlert('Users fetched successfully', 'success');
    } catch (error) {
      addAlert('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    setLoading(true);
    try {
      await api.put(`/users/${userId}`);
      addAlert('User approved successfully', 'success');
      fetchUsers();
    } catch (error) {
      addAlert('Failed to approve user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (userId: string) => {
    setLoading(true);
    try {
      await api.put(`/users/${userId}`);
      addAlert('User rejected successfully', 'success');
      fetchUsers();
    } catch (error) {
      addAlert('Failed to reject user', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <Users className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
                User Management
              </h1>
              <p className="text-gray-600">Approve and manage registered users</p>
            </div>
          </div>

          {/* Back Button */}
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white text-sm font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-blue-50/50 transition-all duration-200">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isApproved ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300">
                          <Check className="h-3 w-3" />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-300">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {!user.isApproved && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(user._id)}
                            className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-semibold rounded-xl focus:ring-4 focus:ring-green-500/20 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            <Check className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(user._id)}
                            className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white text-sm font-semibold rounded-xl focus:ring-4 focus:ring-red-500/20 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            <X className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
