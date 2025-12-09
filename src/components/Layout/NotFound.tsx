import { Link } from "react-router";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center text-center p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5 pointer-events-none"></div>

      <div className="relative bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 max-w-lg mx-auto">
        <AlertTriangle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-5xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-gray-600 mb-6">The page you’re looking for doesn’t exist.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
