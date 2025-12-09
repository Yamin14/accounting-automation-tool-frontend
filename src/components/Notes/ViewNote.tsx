import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
import useNotesStore from "../../store/notesStore";
import useAuthStore from "../../store/authStore";
import api from "../../api/api";
import useAlertStore from "../../store/alertStore";
import { useState } from "react";
import Spinner from "../Layout/Spinner";

const ViewNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notes, setNotes } = useNotesStore();
  const { user } = useAuthStore();
  const { addAlert } = useAlertStore();
  const [loading, setLoading] = useState(false);

  const note = notes.find((n) => n._id === id);

  const fsMap = {
    pnl: "Income Statement",
    balance: "Balance Sheet",
    equity: "Statement of Changes in Equity",
    cashflow: "Cash Flow Statement"
  };

  // delete handler
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        setLoading(true);
        const res = await api.delete(`/notes/${id}`);
        setNotes(res.data.notes);
        navigate("/notes");

      } catch (error) {
        addAlert("Failed to delete note", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading)
    return <Spinner />;

  if (!note) {
    return <div className="p-8 text-center text-gray-600">Note not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="relative max-w-3xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/notes"
            className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
            {note.title}
          </h1>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
              Description
            </h3>
            <p className="text-gray-800 leading-relaxed">{note.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
                Financial Statement
              </h3>
              <p className="text-gray-800">{fsMap[note.financialStatement as keyof typeof fsMap]}</p>
            </div>
          </div>

          {user?.role === "admin" && (
            <div className="flex gap-3 mt-8">
              <Link
                to={`/notes/edit/${note._id}`}
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Link>

              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewNote;
