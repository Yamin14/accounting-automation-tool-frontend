import React, { useState, useEffect } from "react";
import { CheckCircle, Save, Edit3 } from "lucide-react";
import useEntryStore from "../../store/entryStore";
import useAccountingStore from "../../store/accountingStore";

interface EntryData {
  debitAccount: string;
  creditAccount: string;
  description: string;
  amount: number;
}

interface Props {
  onSave: (finalEntry: EntryData) => void;
}

const TransactionPreview: React.FC<Props> = ({ onSave }) => {
  const { entry, setEntry } = useEntryStore();
  const [editableData, setEditableData] = useState(entry || null);
  const [isEditing, setIsEditing] = useState(false);
  const { accounts } = useAccountingStore();

  useEffect(() => {
    setEditableData(entry || null);
  }, [entry]);

  if (!entry) return null;

  const handleSave = () => {
    if (!editableData) return;
    const { debitAccount, creditAccount, description, amount } = editableData;

    if (debitAccount && creditAccount && description && amount > 0) {
      setEntry(debitAccount, creditAccount, description, amount);
      onSave({debitAccount, creditAccount, description, amount});
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-l-8 border-green-500 transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="p-3 bg-green-100 rounded-xl mr-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Transaction Ready</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-3">
          {isEditing ? (
            <div className="space-y-2">
              {/* Description */}
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Description:</span>
                <input
                  required
                  type="text"
                  value={editableData?.description || ""}
                  onChange={(e) =>
                    setEditableData({
                      ...editableData!,
                      description: e.target.value,
                    })
                  }
                  className="ml-2 border-b border-gray-300 focus:border-blue-500 outline-none text-right w-40"
                />
              </div>

              {/* Debit Account with dropdown */}
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Debit Account:</span>
                <input
                  list="preview-debit-accounts"
                  required
                  type="text"
                  value={editableData?.debitAccount || ""}
                  onChange={(e) =>
                    setEditableData({
                      ...editableData!,
                      debitAccount: e.target.value,
                    })
                  }
                  className="ml-2 border-b border-gray-300 focus:border-blue-500 outline-none text-right w-40"
                />
                <datalist id="preview-debit-accounts">
                  {accounts.map((acc: any) => (
                    <option key={acc._id || acc.accountName} value={acc.accountName} />
                  ))}
                </datalist>
              </div>

              {/* Credit Account with dropdown */}
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Credit Account:</span>
                <input
                  list="preview-credit-accounts"
                  required
                  type="text"
                  value={editableData?.creditAccount || ""}
                  onChange={(e) =>
                    setEditableData({
                      ...editableData!,
                      creditAccount: e.target.value,
                    })
                  }
                  className="ml-2 border-b border-gray-300 focus:border-blue-500 outline-none text-right w-40"
                />
                <datalist id="preview-credit-accounts">
                  {accounts.map((acc: any) => (
                    <option key={acc._id || acc.accountName} value={acc.accountName} />
                  ))}
                </datalist>
              </div>

              {/* Amount */}
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Amount:</span>
                <input
                  required
                  type="number"
                  min="0"
                  value={editableData?.amount || ""}
                  onChange={(e) =>
                    setEditableData({
                      ...editableData!,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="ml-2 border-b border-gray-300 focus:border-blue-500 outline-none text-right w-40"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Description:</span>
                <span className="font-medium text-gray-800 text-right ml-2">
                  {editableData?.description || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Debit Account:</span>
                <span className="font-medium text-gray-800 text-right ml-2">
                  {editableData?.debitAccount || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Credit Account:</span>
                <span className="font-medium text-gray-800 text-right ml-2">
                  {editableData?.creditAccount || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Amount:</span>
                <span className="font-medium text-gray-800 text-right ml-2">
                  {editableData?.amount ?? "-"}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center space-y-4">
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Edit3 className="h-5 w-5" />
            {isEditing ? "Stop Editing" : "Edit Transaction"}
          </button>
          <button
            onClick={handleSave}
            disabled={!editableData}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionPreview;
