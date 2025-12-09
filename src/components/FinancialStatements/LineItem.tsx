import { Link, useNavigate } from "react-router-dom";
import { Plus, StickyNote } from "lucide-react";
import useNotesStore from "../../store/notesStore";
import useAccountingStore from "../../store/accountingStore";

interface LineItemProps {
  accountName: string;
  amount: number;
}

const LineItem: React.FC<LineItemProps> = ({ accountName, amount }) => {
  const navigate = useNavigate();
  const { notes } = useNotesStore();
  const { accounts } = useAccountingStore();

  // Find the account object that matches the name
  const matchedAccount = accounts.find(
    (acc) => acc.accountName === accountName
  );
  const accountId = matchedAccount?._id || '';
  
  // Find if there's a note linked to this account
  const linkedNote = notes.find((note) => note.linkedAccount === accountId);
  const noteId = linkedNote?._id;

  const formatAmt = (n: number) =>
    n < 0 ? `(${Math.abs(n).toLocaleString()})` : n.toLocaleString();

  const handleAddNote = () => {
    if (accountId) {
      navigate(`/notes/add?linkedAccount=${accountId}`);
    } else {
      navigate(`/notes/add`);
    }
  };

  return (
    <div className="flex justify-between items-center py-1 text-gray-700">
      <span>{accountName}</span>

      <div className="flex items-center gap-3">
        {noteId ? (
          <Link
            to={`/notes/${noteId}`}
            className="flex items-center text-blue-900 hover:text-blue-700 transition-colors"
            title="View linked note"
          >
            <StickyNote size={18} className="mr-1" />
            {`Note ${linkedNote.noteNumber}`}
          </Link>
        ) : (
          <button
            onClick={handleAddNote}
            className="p-1 rounded-full hover:bg-blue-100 text-blue-900 transition-colors"
            title="Add Note"
          >
            <Plus size={18} />
          </button>
        )}

        <span className="font-medium">PKR {formatAmt(amount)}</span>
      </div>
    </div>
  );
};

export default LineItem;
