import { useMemo } from "react";
import useAccountingStore from "../../store/accountingStore";
import { calculateTotals } from "../../utils/CalculateTotals";
import LineItem from "./LineItem";

const ComprehensiveIncome = () => {
    const { journalEntries, selectedFinancialYear } = useAccountingStore();

    const {
        netIncome,
        comprehensiveRevenue,
        comprehensiveExpense,
        totalComprehensiveIncome,
    } = useMemo(() => {
        const revenueMap: Record<string, number> = {};
        const expenseMap: Record<string, number> = {};
        let revenueTotal = 0;
        let expenseTotal = 0;

        // Step 1️: Calculate Net Income (Profit or Loss)
        const netIncome = calculateTotals(journalEntries).netIncome;

        // Step 2️⃣: Get Comprehensive Income items (any subcategories)
        journalEntries.forEach(({ debitAccount, creditAccount, amount }) => {
            if (debitAccount.financialStatement === "Comprehensive Income") {
                if (debitAccount.category === "Revenue") {
                    revenueMap[debitAccount.accountName] =
                        (revenueMap[debitAccount.accountName] || 0) + amount;
                    revenueTotal += amount;
                } else if (debitAccount.category === "Expense") {
                    expenseMap[debitAccount.accountName] =
                        (expenseMap[debitAccount.accountName] || 0) + amount;
                    expenseTotal += amount;
                }
            }

            if (creditAccount.financialStatement === "Comprehensive Income") {
                if (creditAccount.category === "Revenue") {
                    revenueMap[creditAccount.accountName] =
                        (revenueMap[creditAccount.accountName] || 0) + amount;
                    revenueTotal += amount;
                } else if (creditAccount.category === "Expense") {
                    expenseMap[creditAccount.accountName] =
                        (expenseMap[creditAccount.accountName] || 0) + amount;
                    expenseTotal += amount;
                }
            }
        });

        // Step 3️⃣: Compute total comprehensive income
        const totalComprehensiveIncome = netIncome + (revenueTotal - expenseTotal);

        return {
            netIncome,
            comprehensiveRevenue: revenueMap,
            comprehensiveExpense: expenseMap,
            totalComprehensiveIncome,
        };
    }, [journalEntries]);

    return (
        <div className="space-y-6">
            {/* HEADER */}
            < div className="flex justify-between items-center mb-6" >
                <h2 className="text-xl font-bold text-gray-900">Statement of Comprehensive Income</h2>
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
            </div >

            <div className="bg-white rounded-lg p-6">
                <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Statement of Comprehensive Income</h3>
                    <p className="text-gray-600">
                        For the period ending {selectedFinancialYear?.endDate.slice(0, 10)}
                    </p>
                </div>
            </div>

            <div className="p-6 max-w-3xl mx-auto">
                {/* Net Income */}
                <div className="mb-4 flex justify-between">
                    <h2 className="text-xl font-semibold mb-2 text-blue-700">Net Income</h2>
                    <span className="text-xl font-semibold mb-2 text-blue-700">{netIncome.toLocaleString()}</span>
                </div>

                {/* Comprehensive Income Section */}
                <h2 className="text-lg font-bold mt-6 mb-2">Comprehensive Income</h2>

                <div className="mb-4">
                    <h3 className="font-semibold text-green-700 mb-1">Revenues</h3>
                    <ul className="pl-4">
                        {Object.entries(comprehensiveRevenue).map(([account, amount]) => (
                            <LineItem key={account} accountName={account} amount={amount} />
                        ))}
                    </ul>
                </div>

                <div className="mb-4">
                    <h3 className="font-semibold text-red-700 mb-1">Expenses</h3>
                    <ul className="pl-4">
                        {Object.entries(comprehensiveExpense).map(([account, amount]) => (
                            <LineItem key={account} accountName={account} amount={amount} />
                        ))}
                    </ul>
                </div>

                {/* Total Comprehensive Income */}
                <div className="mb-4 mt-4 flex justify-between border-t pt-2">
                    <h2 className="font-bold text-lg">Total Comprehensive Income</h2>
                    <span className="font-bold text-lg">{totalComprehensiveIncome.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default ComprehensiveIncome;