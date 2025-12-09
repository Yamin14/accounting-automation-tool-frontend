import { Users, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5 pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage users and financial years for your company
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* User Management */}
          <Link
            to="/admin/users"
            className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl hover:scale-105 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                User Management
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Approve, reject, and manage user accounts.
              </p>
              <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </Link>

          {/* Financial Years */}
          <Link
            to="/admin/financial-years"
            className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl hover:scale-105 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Financial Years
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Add, view, or close company financial years.
              </p>
              <ChevronRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Admin;
