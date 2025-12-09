import { useMemo } from "react";
import useAccountingStore from "../../store/accountingStore";
import { calculateTotals } from "../../utils/CalculateTotals";
import LineItem from "./LineItem";

const BalanceSheet = () => {
  const { journalEntries, selectedFinancialYear } = useAccountingStore();

  // Efficient grouping and calculations
  const { groupedData, totals } = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};

    // ✅ Use calculateTotals utility once
    const calculated = calculateTotals(journalEntries);

    for (const entry of journalEntries) {
      const { debitAccount, creditAccount, amount } = entry;

      // Helper function to process any account
      const processAccount = (
        account: {
          accountName: string;
          accountType?: string;
          category: string;
          subCategory: string;
          financialStatement: string;
        },
        isDebit: boolean
      ) => {

        // group key
        let groupKey = account.subCategory ?? account.category;

        // Fix grouping for contra accounts
        if (account.category === "Contra Asset") {
          groupKey = "Contra Asset"; // keep separate
        }
        if (account.category === "Contra Liability") {
          groupKey = "Contra Liability"; // keep separate
        }


        const accName = account.accountName;
        if (!map[groupKey]) map[groupKey] = {};

        // Determine sign
        let sign = 0;
        if (account.category === "Asset") sign = isDebit ? 1 : -1;
        else if (account.category === "Liability" || account.category === "Equity")
          sign = isDebit ? -1 : 1;

        // Update grouped map only (no totals here)
        map[groupKey][accName] =
          (map[groupKey][accName] || 0) + amount * sign;
      };

      // Process both sides
      processAccount(debitAccount, true);
      processAccount(creditAccount, false);
    }

    // ✅ Build totals using calculated values
    const totals = {
      "Equity": calculated.totalEquity,
      "Non-Current Liability": calculated.nonCurrentLiabilities,
      "Current Liability": calculated.currentLiabilities,
      "Non-Current Asset": calculated.nonCurrentAssets,
      "Current Asset": calculated.currentAssets,
      "Asset": calculated.assets,
      "Liability": calculated.liabilities,
    };

    // Add retained earnings to equity section
    if (!map["Equity"]) map["Equity"] = {};
    map["Equity"]["Retained Earnings"] =
      (map["Equity"]["Retained Earnings"] || 0) + calculated.netIncome;

    // Add accumulated oci to equity section
    if (!map["Equity"]) map["Equity"] = {};
    map["Equity"]["Accumulated OCI"] =
      (map["Equity"]["Accumulated OCI"] || 0) + calculated.oci;

    return { groupedData: map, totals };
  }, [journalEntries]);

  const sumSubCategory = (obj: Record<string, number>) =>
    Object.values(obj).reduce((a, b) => a + b, 0);

  const sum = (obj?: Record<string, number>) =>
    obj ? Object.values(obj).reduce((a, b) => a + b, 0) : 0;

  const subtractContra = (normal?: Record<string, number>, contra?: Record<string, number>) =>
    sum(normal) + sum(contra);

  // Helper: render grouped accounts under each section
  const renderSection = (title: string, subCategory: string) => {
    const accounts = groupedData[subCategory];
    if (!accounts) return null;
    return (
      <div className="mb-6">
        {Object.entries(accounts).map(([account, amount]) => (
          <LineItem key={account} accountName={account} amount={amount} />
        ))}
        <div className="flex justify-between items-center py-2 border-t border-gray-200 font-semibold text-gray-800 mt-1">
          <span className="font-bold">Total {title}</span>
          <span className="font-bold">PKR {sumSubCategory(accounts).toLocaleString()}</span>
        </div>
      </div>
    );
  };

  // Order and total calculations
  const totalEquity = totals["Equity"];
  const totalNonCurrentLiabilities = totals["Non-Current Liability"];
  const totalCurrentLiabilities = totals["Current Liability"];
  const totalAssets = totals["Asset"];
  const totalLiabilties = totalNonCurrentLiabilities + totalCurrentLiabilities;

  const totalLiabilitiesEquity = totalEquity + totalLiabilties;
  const isBalanced = Math.abs(totalLiabilitiesEquity - totalAssets) < 1;

  // Return JSX
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Statement of Financial Position (Balance Sheet)
        </h2>
        {/* <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <svg
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Export
        </button> */}
      </div>

      {/* BODY */}
      <div className="bg-white rounded-lg p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Balance Sheet</h3>
          <p className="text-gray-600">
            As on {selectedFinancialYear?.endDate.slice(0, 10)}
          </p>
        </div>

        {/* === LIABILITIES AND EQUITY SECTION === */}
        <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-300">
          LIABILITIES AND EQUITY
        </h3>

        {/* --- EQUITY --- */}
        <h4 className="text-lg font-semibold text-purple-700 mb-3 border-b border-purple-200">
          Owner's Equity
        </h4>
        {[
          "Equity"
        ].map((sub) => renderSection("Owner's Equity", sub))}

        {/* --- NON-CURRENT LIABILITIES --- */}
        <h4 className="text-lg font-semibold text-red-700 mb-3 border-b border-red-200 mt-6">
          Non-Current Liabilities
        </h4>

        {/* Regular Non-Current Liabilities (no total yet) */}
        {["Non-current Liability"].map(() => {
          const accounts = groupedData["Non-current Liability"];
          if (!accounts) return null;

          return (
            <>
              {Object.entries(accounts).map(([acc, amt]) => (
                <LineItem key={acc} accountName={acc} amount={amt} />
              ))}
            </>
          );
        })}

        {/* Contra liabilities */}
        {groupedData["Contra Liability"] && (
          <>
            {Object.entries(groupedData["Contra Liability"]).map(([acc, amt]) => (
              <LineItem key={acc} accountName={`(${acc})`} amount={-amt} />
            ))}
          </>
        )}

        {/* Total */}
        <div className="flex justify-between items-center py-2 border-t border-gray-200 font-semibold text-gray-800 mt-1">
          <span className="font-bold">Total Non-Current Liabilities</span>
          <span className="font-bold">
            PKR{" "}
            {subtractContra(
              groupedData["Non-current Liability"],
              groupedData["Contra Liability"]
            ).toLocaleString()}
          </span>
        </div>


        {/* --- CURRENT LIABILITIES --- */}
        <h4 className="text-lg font-semibold text-orange-700 mb-3 border-b border-orange-200 mt-6">
          Current Liabilities
        </h4>
        {[
          "Current Liability"
        ].map((sub) => renderSection("Current Liabilities", sub))}


        <div className="my-6 p-4 rounded-lg border border-gray-200 bg-gray-50">
          <div className="flex justify-between font-bold text-gray-800">
            <span>Total Liabilities & Equity</span>
            <span>PKR {totalLiabilitiesEquity.toLocaleString()}</span>
          </div>
        </div>

        {/* === ASSETS SECTION === */}
        <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-300 mt-10">
          ASSETS
        </h3>

        <h4 className="text-lg font-semibold text-blue-700 mb-3 border-b border-blue-200">
          Non-Current Assets
        </h4>

        {/* Regular Non-Current Assets (no total yet) */}
        {["Non-current Asset"].map(() => {
          const accounts = groupedData["Non-current Asset"];
          if (!accounts) return null;

          return (
            <>
              {Object.entries(accounts).map(([acc, amt]) => (
                <LineItem key={acc} accountName={acc} amount={amt} />
              ))}
            </>
          );
        })}

        {/* Contra assets */}
        {groupedData["Contra Asset"] && (
          <>
            {Object.entries(groupedData["Contra Asset"]).map(([acc, amt]) => (
              <LineItem key={acc} accountName={`(${acc})`} amount={-amt} />
            ))}
          </>
        )}

        {/* Total */}
        <div className="flex justify-between items-center py-2 border-t border-gray-200 font-semibold text-gray-800 mt-1">
          <span className="font-bold">Total Non-Current Assets</span>
          <span className="font-bold">
            PKR{" "}
            {subtractContra(
              groupedData["Non-current Asset"],
              groupedData["Contra Asset"]
            ).toLocaleString()}
          </span>
        </div>

        {/* --- CURRENT ASSETS --- */}
        <h4 className="text-lg font-semibold text-green-700 mb-3 border-b border-green-200 mt-6">
          Current Assets
        </h4>
        {[
          "Current Asset"
        ].map((sub) => renderSection("Current Assets", sub))}

        <div className="mt-6 p-4 rounded-lg border border-gray-200 bg-gray-50">
          <div className="flex justify-between font-bold text-gray-800 mt-2">
            <span>Total Assets</span>
            <span>PKR {totalAssets.toLocaleString()}</span>
          </div>
        </div>

        {/* Balance Check */}
        <div
          className={`mt-6 p-4 rounded-lg ${isBalanced
            ? "bg-green-50 border border-green-200"
            : "bg-red-50 border border-red-200"
            }`}
        >
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-700">Balance Check</span>
            <span
              className={`font-bold ${isBalanced ? "text-green-600" : "text-red-600"
                }`}
            >
              {isBalanced ? "✓ Balanced" : "⚠ Unbalanced"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;
