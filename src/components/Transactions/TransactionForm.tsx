import React, { useState } from "react";
import { Send, Loader2, Plus } from "lucide-react";
import useEntryStore from "../../store/entryStore";
import useAccountingStore from "../../store/accountingStore";

interface Props {
  mode: "ai" | "manual";
  onParse: (prompt: string) => void;
  loading: boolean;
}

const TransactionForm: React.FC<Props> = ({ mode, onParse, loading }) => {
  const [prompt, setPrompt] = useState("");
  const [manualData, setManualData] = useState({
    description: "",
    debitAccount: "",
    creditAccount: "",
    amount: "",
  });

  const { setEntry } = useEntryStore();
  const { accounts } = useAccountingStore();

  const handleAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onParse(prompt);
  };

  const handleManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !manualData.description.trim() ||
      !manualData.debitAccount.trim() ||
      !manualData.creditAccount.trim() ||
      !manualData.amount
    )
      return;

    setEntry(
      manualData.debitAccount,
      manualData.creditAccount,
      manualData.description,
      parseFloat(manualData.amount)
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300">
      {mode === "ai" ? (
        <form onSubmit={handleAI} className="space-y-4">
          <textarea
            className="w-full p-6 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none h-32 text-lg placeholder-gray-400 bg-white/50"
            placeholder="e.g. Paid rent 2000"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!prompt.trim() || loading}
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl py-3 font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-xl transition-all duration-200"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            {loading ? "Parsing..." : "Parse Transaction"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleManual} className="space-y-4">
          <input
            type="text"
            placeholder="Description"
            value={manualData.description}
            onChange={(e) =>
              setManualData({ ...manualData, description: e.target.value })
            }
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none bg-white/50"
          />

          {/* Debit Account */}
          <input
            list="debit-accounts"
            type="text"
            placeholder="Debit Account"
            value={manualData.debitAccount}
            onChange={(e) =>
              setManualData({ ...manualData, debitAccount: e.target.value })
            }
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none bg-white/50"
          />
          <datalist id="debit-accounts">
            {accounts.map((acc: any) => (
              <option key={acc._id || acc.accountName} value={acc.accountName} />
            ))}
          </datalist>

          {/* Credit Account */}
          <input
            list="credit-accounts"
            type="text"
            placeholder="Credit Account"
            value={manualData.creditAccount}
            onChange={(e) =>
              setManualData({ ...manualData, creditAccount: e.target.value })
            }
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none bg-white/50"
          />
          <datalist id="credit-accounts">
            {accounts.map((acc: any) => (
              <option key={acc._id || acc.accountName} value={acc.accountName} />
            ))}
          </datalist>

          <input
            type="number"
            placeholder="Amount"
            value={manualData.amount}
            min={"0"}
            onChange={(e) =>
              setManualData({ ...manualData, amount: e.target.value })
            }
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none bg-white/50"
          />
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl py-3 font-semibold hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            Add Transaction
          </button>
        </form>
      )}
    </div>
  );
};

export default TransactionForm;
