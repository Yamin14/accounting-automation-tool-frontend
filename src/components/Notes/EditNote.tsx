import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import useNotesStore from "../../store/notesStore";
import useAccountingStore from "../../store/accountingStore";
import api from "../../api/api";
import useAlertStore from "../../store/alertStore";
import Spinner from "../Layout/Spinner";

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notes, setNotes } = useNotesStore();
  const { accounts } = useAccountingStore();
  const { addAlert } = useAlertStore();
  const [loading, setLoading] = useState(false);

  const existingNote = notes.find((n) => n._id === id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    linkedAccount: "",
    financialStatement: "pnl",
  });

  useEffect(() => {
    if (existingNote) {
      setFormData({
        title: existingNote.title,
        description: existingNote.description,
        linkedAccount: existingNote.linkedAccount || "",
        financialStatement: existingNote.financialStatement,
      });
    }
  }, [existingNote]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.put(`/notes/${id}`, formData);
      setNotes(res.data.notes);
      addAlert(res.data.message, "success");
      navigate("/notes");

    } catch (err) {
      addAlert("Failed to update note", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <Spinner />;

  if (!existingNote) {
    return (
      <div className="p-8 text-center text-gray-600">Note not found.</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="relative max-w-3xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/notes"
            className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
            Edit Note
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/50 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/50 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Financial Statement
              </label>
              <select
                name="financialStatement"
                value={formData.financialStatement}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/50 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="pnl">Income Statement</option>
                <option value="balance">Balance Sheet</option>
                <option value="equity">Changes in Equity</option>
                <option value="cashflow">Cash Flow</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Linked Account (Optional)
              </label>
              <select
                name="linkedAccount"
                value={formData.linkedAccount}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/50 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">None</option>
                {accounts.map((acc) => (
                  <option key={acc._id} value={acc._id}>
                    {acc.accountName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-2xl transform hover:scale-105"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditNote;
