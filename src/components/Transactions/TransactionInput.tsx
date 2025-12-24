import React, { useState } from "react";
import { Loader2, Cpu, Pencil } from "lucide-react";
import TransactionForm from "./TransactionForm";
import TransactionPreview from "./TransactionPreview";
import api from "../../api/api";
import parseTransaction from "../../utils/TransactionParser";
import useAuthStore from "../../store/authStore";
import Spinner from "../Layout/Spinner";
import useAlertStore from "../../store/alertStore";
import validateEntry from "../../utils/ValidateEntry";
import useEntryStore from "../../store/entryStore";
import useAccountingStore from "../../store/accountingStore";

const TransactionInput: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [parseLoading, setParseLoading] = useState(false);
  const [mode, setMode] = useState<"ai" | "manual">("ai");

  const { user } = useAuthStore();
  const { accounts, setAccounts, activeFinancialYear, setJournalEntries } = useAccountingStore();
  const { addAlert } = useAlertStore();
  const { entry, setEntry, clearEntry } = useEntryStore();

  const handleParse = async (prompt: string) => {
    setParseLoading(true);
    try {
      const data = await parseTransaction(prompt, user);
      setEntry(data.debitAccount, data.creditAccount, data.description, data.amount);
    } catch (err) {
      addAlert("Error parsing transaction. Please try again.", "error");
    } finally {
      setParseLoading(false);
    }
  };

  const handleSave = async (finalEntry: {debitAccount: string, creditAccount: string, description: string, amount: number}) => {
    if (!finalEntry) return;
    try {
      setLoading(true);
      const valid = validateEntry(finalEntry, accounts.map(acc => acc.accountName));
      if (!valid.valid) {
        addAlert(`Validation Error: ${valid.message}`, "error");
        return;
      }

      const date = new Date().toISOString();
      const res = await api.post("/journal-entries", { ...finalEntry, date });
      setAccounts(res.data.accounts);
      setJournalEntries(res.data.entries);
      
      addAlert("Transaction saved successfully!", "success");
      clearEntry();

    } catch (error) {
      addAlert("Error saving transaction. Please try again.", "error");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  // return
  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Smart Transaction Entry
        </h1>
        <p className="text-gray-600">
          Active Financial Year:{" "}
          <span className="font-semibold text-blue-700">{activeFinancialYear?.name || "Error"}</span>
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <button
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-200 ${
            mode === "ai"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105"
              : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
          }`}
          onClick={() => setMode("ai")}
        >
          <Cpu className="h-5 w-5" /> AI Mode
        </button>
        <button
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-200 ${
            mode === "manual"
              ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105"
              : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
          }`}
          onClick={() => setMode("manual")}
        >
          <Pencil className="h-5 w-5" /> Manual Mode
        </button>
      </div>

      <TransactionForm mode={mode} onParse={handleParse} loading={parseLoading} />

      {parseLoading && (
        <div className="flex justify-center mt-6">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
      )}

      {entry && <TransactionPreview onSave={(finalEntry) => handleSave(finalEntry)} />}
    </div>
  );
};

export default TransactionInput;
