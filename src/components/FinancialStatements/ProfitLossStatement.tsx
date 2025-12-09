import { useMemo } from "react";
import useAccountingStore from "../../store/accountingStore";
import LineItem from "./LineItem";

const ProfitLossStatement = () => {
  const { journalEntries, selectedFinancialYear } = useAccountingStore();

  const { groupedData, totals } = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    const totals = {
      Revenue: 0,
      ContraRevenue: 0,
      COGS: 0,
      OperatingExpenses: 0,
      Depreciation: 0,
      FinanceIncome: 0,
      FinanceCost: 0,
      NonOperatingRevenue: 0,
      NonOperatingExpenses: 0,
      TaxExpense: 0,
    };

    for (const entry of journalEntries) {
      const { debitAccount, creditAccount, amount } = entry;

      // Expenses (Debit)
      if (
        debitAccount.category === "Expense" &&
        debitAccount.financialStatement === "Income Statement"
      ) {
        const sub = debitAccount.subCategory ?? "Other Expenses";
        const acc = debitAccount.accountName;
        if (!map[sub]) map[sub] = {};
        map[sub][acc] = (map[sub][acc] || 0) + amount;

        if (sub === "Cost of Goods Sold") totals.COGS += amount;
        else if (sub === "Operating Expense - Depreciation") totals.Depreciation += amount;
        else if (sub.includes("Interest Expense")) totals.FinanceCost += amount;
        else if (sub.includes("Tax Expense")) totals.TaxExpense += amount;
        else if (sub.toLowerCase().includes("non")) totals.NonOperatingExpenses += amount;
        else totals.OperatingExpenses += amount;
      }

      // Contra Revenue (Debit to Revenue)
      if (
        debitAccount.category === "Revenue" &&
        debitAccount.financialStatement === "Income Statement"
      ) {
        const sub = debitAccount.subCategory ?? "Contra Revenue";
        const acc = debitAccount.accountName;
        if (!map[sub]) map[sub] = {};
        map[sub][acc] = (map[sub][acc] || 0) + amount;
        if (sub === "Contra Revenue") totals.ContraRevenue += amount;
      }

      // Revenue (Credit)
      if (
        creditAccount.category === "Revenue" &&
        creditAccount.financialStatement === "Income Statement"
      ) {
        const sub = creditAccount.subCategory ?? "Other Revenue";
        const acc = creditAccount.accountName;
        if (!map[sub]) map[sub] = {};
        map[sub][acc] = (map[sub][acc] || 0) + amount;

        if (sub === "Revenue") totals.Revenue += amount;
        else if (sub.includes("Interest Income")) totals.FinanceIncome += amount;
        else if (sub.toLowerCase().includes("non")) totals.NonOperatingRevenue += amount;
      }
    }

    return { groupedData: map, totals };
  }, [journalEntries]);

  // Calculations
  const netRevenue = totals.Revenue - totals.ContraRevenue;
  const grossProfit = netRevenue - totals.COGS;
  const ebitda = grossProfit - totals.OperatingExpenses;
  const ebit = ebitda - totals.Depreciation;
  const incomeBeforeTax =
    ebit +
    totals.FinanceIncome -
    totals.FinanceCost +
    totals.NonOperatingRevenue -
    totals.NonOperatingExpenses;
  const netIncome = incomeBeforeTax - totals.TaxExpense;

  const renderLines = (subCategory: string) => {
    const accounts = groupedData[subCategory];
    if (!accounts || Object.keys(accounts).length === 0) return null;
    return Object.entries(accounts).map(([name, amount]) => (
      <LineItem key={name} accountName={name} amount={amount} />));
  };

  const TotalLine = ({ label, amount, bold = true, underline = false }: { label: string; amount: number; bold?: boolean; underline?: boolean }) => (
    <div
      className={`flex justify-between py-2 ${bold ? "font-bold" : "font-medium"} ${
        underline ? "border-t-2 border-gray-800" : ""
      }`}
    >
      <span className="text-gray-900">{label}</span>
      <span className="text-gray-900">PKR {Math.abs(amount).toLocaleString()}</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Income Statement</h2>
        <p className="text-gray-600 mt-1">
          For the year ended {selectedFinancialYear?.endDate.slice(0, 10)}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 space-y-4">

          {/* Revenue */}
          {renderLines("Revenue")}
          {renderLines("Contra Revenue")}
          <TotalLine label="Net Revenue" amount={netRevenue} underline />

          {/* COGS */}
          {renderLines("Cost of Goods Sold")}
          <TotalLine label="Gross Profit" amount={grossProfit} underline />

          {/* Operating Expenses (excluding depreciation) */}
          {[
            "Operating Expense",
            "Selling Expense",
            "Administrative Expense",
            "Marketing Expense",
            "Other Operating Expense",
          ].map((cat) => renderLines(cat))}

          <TotalLine label="EBITDA" amount={ebitda} />

          {/* Depreciation */}
          {renderLines("Operating Expense - Depreciation")}
          <TotalLine label="Operating Income (EBIT)" amount={ebit} underline />

          {/* Finance & Non-operating */}
          {renderLines("Interest Income")}
          {renderLines("Interest Expense")}
          {renderLines("Non-operating Income")}
          {renderLines("Non-operating Expense")}

          <TotalLine label="Income Before Tax" amount={incomeBeforeTax} underline />

          {/* Tax */}
          {renderLines("Tax Expense")}

          {/* Final Net Income */}
          <div className="mt-6 pt-6 border-t-4 border-double border-gray-900">
            <div className="flex justify-between text-xl font-bold">
              <span className={netIncome >= 0 ? "text-green-700" : "text-red-700"}>
                Net {netIncome >= 0 ? "Profit" : "Loss"}
              </span>
              <span className={netIncome >= 0 ? "text-green-700" : "text-red-700"}>
                PKR {Math.abs(netIncome).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Button */}
      {/* <div className="text-center mt-8">
        <button className="inline-flex items-center px-5 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export to PDF
        </button>
      </div> */}
    </div>
  );
};

export default ProfitLossStatement;