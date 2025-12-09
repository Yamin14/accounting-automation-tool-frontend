import { useMemo } from "react";
import useAccountingStore from "../../store/accountingStore";
import { calculateTotals } from "../../utils/CalculateTotals";

const EquityStatement = () => {
  const { journalEntries, selectedFinancialYear } = useAccountingStore();

  const { equityAccounts, totalEquity } = useMemo(() => {
    const map: Record<string, number> = {};
    const calculated = calculateTotals(journalEntries);

    // 🔹 Go through all entries and pick those with category = "Equity"
    for (const entry of journalEntries) {
      const { debitAccount, creditAccount, amount } = entry;

      const processAccount = (
        account: {
          accountName: string;
          category: string;
        },
        isDebit: boolean
      ) => {
        if (account.category !== "Equity") return;

        // Normal sign logic for equity
        const sign = isDebit ? -1 : 1;
        map[account.accountName] =
          (map[account.accountName] || 0) + amount * sign;
      };

      processAccount(debitAccount, true);
      processAccount(creditAccount, false);
    }

    // 🔹 Add retained earnings (net income) and OCI
    map["Retained Earnings"] =
      (map["Retained Earnings"] || 0) + calculated.netIncome;
    map["Accumulated OCI"] =
      (map["Accumulated OCI"] || 0) + calculated.oci;

    // 🔹 Compute total equity
    const totalEquity = Object.values(map).reduce((a, b) => a + b, 0);

    return { equityAccounts: map, totalEquity };
  }, [journalEntries]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <h2 className="text-xl font-bold text-gray-900">
        Statement of Changes in Equity
      </h2>

      <div className="bg-white rounded-lg p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            Statement of Changes in Equity
          </h3>
          <p className="text-gray-600">
            For the year ended{" "}
            {selectedFinancialYear?.endDate.slice(0, 10) ??
              new Date().toLocaleDateString("en-GB")}
          </p>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Component
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Beginning Balance
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Changes During Period
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ending Balance
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(equityAccounts).map(([name, value]) => (
                <tr key={name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    PKR 0
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    PKR {value.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                    PKR {value.toLocaleString()}
                  </td>
                </tr>
              ))}

              <tr className="bg-gray-50 border-t-2 border-gray-300">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  Total Equity
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold">
                  PKR 0
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold">
                  PKR {totalEquity.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold">
                  PKR {totalEquity.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EquityStatement;
