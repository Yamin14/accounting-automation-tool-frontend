import { Link } from "react-router";
import { Lock } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center text-center p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5 pointer-events-none"></div>

      <div className="relative bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 max-w-lg mx-auto">
        <Lock className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Unauthorized</h1>
        <p className="text-gray-600 mb-6">You don’t have permission to view this page.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
