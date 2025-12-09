import React, { useCallback, useMemo, useState } from 'react';
import useAccountingStore from '../../store/accountingStore';
import { calculateTotals, calculateRatios } from '../../utils/chatBotCalculations';
import { calculateHealthScore, generateBotReply } from '../../utils/chatBotCalculations';
import { Bot, X } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

type Chat = { role: 'user' | 'bot'; message: string };

const Chatbot: React.FC = () => {
  const { accounts, journalEntries, selectedFinancialYear } = useAccountingStore();

  const [messages, setMessages] = useState<Chat[]>([
    {
      role: 'bot',
      message:
        "Hello! I'm your AI Financial Health Assistant. Ask about health score, ratios, recommendations, or sector analysis."
    }
  ]);

  const [open, setOpen] = useState(false);

  // --- FILTER JOURNAL ENTRIES FOR SELECTED YEAR (used only if chatbot needs narratives) ---
  const entriesForYear = useMemo(() => {
    if (!selectedFinancialYear) return journalEntries;
    return journalEntries.filter(
      e =>
        e.financialYear === selectedFinancialYear._id ||
        e.financialYear === selectedFinancialYear.name
    );
  }, [journalEntries, selectedFinancialYear]);

  // --- TOTALS (correct usage of utility file) ---
  const totals = useMemo(() => {
    if (!selectedFinancialYear) return calculateTotals(accounts);
    return calculateTotals(accounts, selectedFinancialYear._id);
  }, [accounts, selectedFinancialYear]);

  // --- RATIOS (utility requires totals) ---
  const ratios = useMemo(() => {
    return calculateRatios(totals);
  }, [totals]);

  // --- HEALTH SCORE (totals + ratios) ---
  const healthScore = useMemo(() => {
    return calculateHealthScore(totals, ratios);
  }, [totals, ratios]);

  // --- HANDLE USER MESSAGE ---
  const handleUserMessage = useCallback(
    async (text: string) => {
      const userMsg = { role: 'user' as const, message: text };
      setMessages(prev => [...prev, userMsg]);

      const botMessage = generateBotReply(text, {
        totals,
        ratios,
        healthScore,
        selectedFinancialYear
      });

      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'bot', message: botMessage }]);
      }, 600);
    },
    [totals, ratios, healthScore, selectedFinancialYear, entriesForYear]
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">AI Financial Health Assistant</h3>
          <p className="text-sm text-gray-500">
            Ask about profitability, liquidity, leverage, efficiency, sector, or get recommendations.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg"
          >
            <Bot className="h-4 w-4" />
            {open ? 'Close' : 'Open'} Assistant
          </button>
        </div>
      </div>

      {open && (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-4 flex flex-col h-[520px]">
          <div className="flex items-center justify-between border-b pb-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold">AI Financial Health Assistant</h4>
                <p className="text-xs text-gray-500">
                  Using your selected financial year: {selectedFinancialYear?.name ?? 'All years'}
                </p>
              </div>
            </div>

            <button onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-gray-100">
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-3">
            {messages.map((m, i) => (
              <ChatMessage key={i} role={m.role} message={m.message} />
            ))}
          </div>

          <div className="pt-3 border-t">
            <ChatInput onSend={handleUserMessage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
