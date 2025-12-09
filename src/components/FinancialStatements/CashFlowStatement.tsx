import { useMemo } from "react";
import useAccountingStore from "../../store/accountingStore";
import { calculateTotals } from "../../utils/CalculateTotals";
import LineItem from "./LineItem";

const CashFlowStatement = () => {
  const { journalEntries, selectedFinancialYear } = useAccountingStore();

  const {
    operatingActivities,
    investingActivities,
    financingActivities,
    cashFromOperating,
    cashFromInvesting,
    cashFromFinancing,
    netChangeInCash,
  } = useMemo(() => {
    const calculated = calculateTotals(journalEntries);

    const operatingActivities: Record<string, number> = {};
    const investingActivities: Record<string, number> = {};
    const financingActivities: Record<string, number> = {};

    const addToGroup = (
      group: Record<string, number>,
      accountName: string,
      amount: number
    ) => {
      group[accountName] = (group[accountName] || 0) + amount;
    };

    // ✅ Use the cashFlowSection property directly (if available)
    // Possible values: "Operating", "Investing", "Financing", "None"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const classifyActivity = (acct: any): "operating" | "investing" | "financing" | null => {
      const section = (acct.cashFlowSection || "").toLowerCase();

      if (section === "operating") return "operating";
      if (section === "investing") return "investing";
      if (section === "financing") return "financing";

      // fallback for backward compatibility
      const subcat = (acct.subCategory || "").toLowerCase();
      const cat = (acct.category || "").toLowerCase();
      if (cat === "revenue" || cat === "expense" || subcat.includes("revenue") || subcat.includes("expense")) {
        return "operating";
      }
      if (cat === "asset" || subcat.includes("asset") || subcat.includes("equipment") || subcat.includes("investment")) {
        return "investing";
      }
      if (cat === "equity" || cat === "liability" || subcat.includes("loan") || subcat.includes("capital") || subcat.includes("equity")) {
        return "financing";
      }
      return null;
    };

    for (const entry of journalEntries) {
      const { debitAccount, creditAccount, amount } = entry;

      const debitIsCash = debitAccount.accountName.toLowerCase().includes("cash");
      const creditIsCash = creditAccount.accountName.toLowerCase().includes("cash");

      // only process cash transactions
      if (!debitIsCash && !creditIsCash) continue;

      // determine non-cash side
      const otherAccount = debitIsCash ? creditAccount : debitAccount;
      const activity = classifyActivity(otherAccount);

      const cashSign = debitIsCash ? +1 : -1;
      const amt = cashSign * amount;

      // ✅ route based on cashFlowSection classification
      if (activity === "operating") {
        addToGroup(operatingActivities, otherAccount.accountName, amt);
      } else if (activity === "investing") {
        addToGroup(investingActivities, otherAccount.accountName, amt);
      } else if (activity === "financing") {
        addToGroup(financingActivities, otherAccount.accountName, amt);
      } else {
        // default fallback to operating if undefined
        addToGroup(operatingActivities, otherAccount.accountName, amt);
      }
    }

    const cashFromOperating = Object.values(operatingActivities).reduce((a, b) => a + b, 0);
    const cashFromInvesting = Object.values(investingActivities).reduce((a, b) => a + b, 0);
    const cashFromFinancing = Object.values(financingActivities).reduce((a, b) => a + b, 0);

    const netChangeInCash = cashFromOperating + cashFromInvesting + cashFromFinancing;

    return {
      netIncome: calculated.netIncome || 0,
      operatingActivities,
      investingActivities,
      financingActivities,
      cashFromOperating,
      cashFromInvesting,
      cashFromFinancing,
      netChangeInCash,
    };
  }, [journalEntries]);

  const colorMap = {
    operating: { heading: "text-blue-700", border: "border-blue-200" },
    investing: { heading: "text-green-700", border: "border-green-200" },
    financing: { heading: "text-purple-700", border: "border-purple-200" },
  };

  const formatAmt = (n: number) =>
    n < 0 ? `PKR (${Math.abs(n).toLocaleString()})` : `PKR ${n.toLocaleString()}`;

  const renderSection = (
    title: string,
    data: Record<string, number>,
    total: number,
    kind: "operating" | "investing" | "financing"
  ) => {
    const clr = colorMap[kind];
    return (
      <div>
        <h4 className={`text-lg font-semibold ${clr.heading} mb-4 pb-2 ${clr.border}`}>
          {title}
        </h4>

        <div className="space-y-2">
          {Object.keys(data).length === 0 ? (
            <p className="text-gray-500">No transactions recorded</p>
          ) : (
            Object.entries(data).map(([account, amount]) => (
              <LineItem key={account} accountName={account} amount={amount} />
            ))
          )}

          <div className="flex justify-between items-center border-t border-gray-200 font-bold pt-2 mt-2">
            <span className={clr.heading}>
              {kind === "operating"
                ? "Net Cash from Operating Activities"
                : kind === "investing"
                ? "Net Cash from Investing Activities"
                : "Net Cash from Financing Activities"}
            </span>
            <span className={clr.heading}>{formatAmt(total)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Statement of Cash Flows</h2>

      <div className="bg-white rounded-lg p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Statement of Cash Flows</h3>
          <p className="text-gray-600">
            For the year ended{" "}
            {selectedFinancialYear?.endDate?.slice(0, 10) ??
              new Date().toLocaleDateString("en-GB")}
          </p>
        </div>

        <div className="space-y-6">
          {renderSection("CASH FLOWS FROM OPERATING ACTIVITIES", operatingActivities, cashFromOperating, "operating")}
          {renderSection("CASH FLOWS FROM INVESTING ACTIVITIES", investingActivities, cashFromInvesting, "investing")}
          {renderSection("CASH FLOWS FROM FINANCING ACTIVITIES", financingActivities, cashFromFinancing, "financing")}

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center font-bold text-lg">
              <span className="text-gray-900">Net Change in Cash</span>
              <span className="text-gray-900">{formatAmt(netChangeInCash)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashFlowStatement;
