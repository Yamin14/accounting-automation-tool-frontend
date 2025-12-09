import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, NotebookPen, Filter } from 'lucide-react';
import { Link } from 'react-router';
import useAuthStore from '../../store/authStore';
import useAccountingStore from '../../store/accountingStore';
import useNotesStore from '../../store/notesStore';
import SetFinancialYear from '../Transactions/SetFinancialYear';
import api from '../../api/api';
import useAlertStore from '../../store/alertStore';

const Notes = () => {
  const { notes, setNotes } = useNotesStore();
  const { selectedFinancialYear: financialYear } = useAccountingStore();
  const { user } = useAuthStore();
  const { addAlert } = useAlertStore();

  // create a readable mapping
  const fsMap = {
    pnl: "Income Statement",
    balance: "Balance Sheet",
    equity: "Statement of Changes in Equity",
    cashflow: "Cash Flow Statement"
  };
  const [financialStatementFilter, setFinancialStatementFilter] = useState('All');

  // derive unique codes and names
  const uniqueFinancialStatements = useMemo(() => {
    const codes = [...new Set(notes.map(n => n.financialStatement))];
    return ['All', ...codes];
  }, [notes]);

  // filter notes
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      return (
        (financialStatementFilter === 'All' ||
          note.financialStatement === financialStatementFilter)
      );
    });
  }, [notes, financialStatementFilter]);

  // delete handler
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        const res = await api.delete(`/notes/${id}`);
        setNotes(res.data.notes);

      } catch (error) {
        addAlert("Failed to delete note", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl">
              <NotebookPen className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Notes to the Accounts
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your financial statement notes
              </p>
            </div>
          </div>

          <Link
            to="/notes/add"
            className="inline-flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add Note
          </Link>
        </div>

        {/* Financial Year Info */}
        <div className="flex justify-between items-center mb-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Financial Year: <span className="text-blue-700">{financialYear?.name || 'None Selected'}</span>
            </h2>
          </div>
          <SetFinancialYear />
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filter Notes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Financial Statement
              </label>
              <select
                value={financialStatementFilter}
                onChange={(e) => setFinancialStatementFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
              >
                {uniqueFinancialStatements.map((fs) => (
                  <option key={fs} value={fs}>
                    {fs === 'All' ? 'All' : fsMap[fs as keyof typeof fsMap]}
                  </option>
                ))}
              </select>

            </div>
          </div>
        </div>

        {/* Notes List */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Note #
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Financial Statement
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredNotes.map((note) => (
                  <tr
                    key={note._id}
                    className="hover:bg-blue-50/50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {note.noteNumber}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <Link to={`/notes/${note._id}`}>{note.title}</Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {fsMap[note.financialStatement as keyof typeof fsMap]}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {note.description}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <Link
                        to={`/notes/edit/${note._id}`}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </Link>
                      {user.role === 'admin' && (
                        <button
                          onClick={() => handleDelete(note._id)}
                          className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white text-xs font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredNotes.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No notes found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;
