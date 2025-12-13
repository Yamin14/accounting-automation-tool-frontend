import { useState, useEffect } from 'react';
import { Edit2, Plus, Calendar, DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { Link } from 'react-router';
import api from '../../api/api';
import useCalculationsStore from '../../store/calculationsStore';
import Spinner from '../Layout/Spinner';
import type { BudgetType } from '../../store/types';

const Budget = () => {
    const [budget, setBudget] = useState<BudgetType | null>(null);
    const [loading, setLoading] = useState(true);
    const { totals } = useCalculationsStore();

    // Inflation state
    const [adjustForInflation, setAdjustForInflation] = useState(false);
    const [inflationRate, setInflationRate] = useState(6); // 6% default

    useEffect(() => {
        const fetchBudget = async () => {
            try {
                const res = await api.get('/budgets/current');
                setBudget(res.data.budget);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBudget();
    }, []);

    if (loading) return <Spinner />;

    const fmt = (num: number) => `$${Math.abs(num).toLocaleString()}`;

    // Helper: Apply inflation compounding over years (assuming budget is for current or next year → 1-year forward adjustment)
    const applyInflation = (baseAmount: number) => {
        if (!adjustForInflation || inflationRate <= 0) return baseAmount;
        const rate = inflationRate / 100;
        // Simple 1-year forward inflation (you can extend to multi-year if needed)
        return Math.round(baseAmount * (1 + rate));
    };

    const budgetRows = budget ? [
        {
            label: "Revenue",
            budgeted: applyInflation(budget.revenue?.budgetedAmount || 0),
            actual: totals.revenue,
            icon: <TrendingUp className="w-5 h-5" />,
            favorableWhen: "higher",
            applyInflation: true
        },
        {
            label: "COGS",
            budgeted: applyInflation(budget.cogs?.budgetedAmount || 0),
            actual: totals.cogs,
            icon: <TrendingDown className="w-5 h-5" />,
            favorableWhen: "lower",
            applyInflation: true
        },
        {
            label: "Operating Expenses",
            budgeted: applyInflation(budget.operatingExpenses?.budgetedAmount || 0),
            actual: totals.operatingExpenses,
            icon: <TrendingDown className="w-5 h-5" />,
            favorableWhen: "lower",
            applyInflation: true
        },
        {
            label: "Net Income",
            budgeted: budget.netIncome?.budgetedAmount || 0,
            actual: totals.netIncome,
            icon: <DollarSign className="w-5 h-5" />,
            favorableWhen: "higher",
            applyInflation: false
        },
        {
            label: "Capex",
            budgeted: applyInflation(budget.capex?.budgetedAmount || 0),
            actual: Math.abs(totals.netFixedAssets),
            icon: <TrendingDown className="w-5 h-5" />,
            favorableWhen: "lower",
            applyInflation: true
        },
        {
            label: "Cash Inflows",
            budgeted: budget.cashInflows?.budgetedAmount || 0,
            actual: totals.cashInflows,
            icon: <ArrowUpRight className="w-5 h-5" />,
            favorableWhen: "higher",
            applyInflation: false
        },
        {
            label: "Cash Outflows",
            budgeted: budget.cashOutflows?.budgetedAmount || 0,
            actual: totals.cashOutflows,
            icon: <ArrowDownRight className="w-5 h-5" />,
            favorableWhen: "lower",
            applyInflation: false
        }
    ] : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5 pointer-events-none"></div>
            <div className="relative max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl">
                            <DollarSign className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                Annual Budget vs Actual
                            </h1>
                            <p className="text-gray-600 mt-1">Financial Year {budget?.financialYear.name || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {budget ? (
                            <Link to="/admin/budget/edit" className="inline-flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105">
                                <Edit2 className="w-5 h-5" /> Edit Budget
                            </Link>
                        ) : (
                            <Link to="/admin/budget/create" className="inline-flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105">
                                <Plus className="w-5 h-5" /> Create Budget
                            </Link>
                        )}
                    </div>
                </div>

                {/* Inflation Toggle & Rate Input */}
                <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={adjustForInflation}
                                onChange={(e) => setAdjustForInflation(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-indigo-600"></div>
                            <span className="ml-3 text-lg font-medium text-gray-800">Adjust for Inflation</span>
                        </label>

                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={inflationRate}
                                onChange={(e) => setInflationRate(Number(e.target.value))}
                                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="0"
                                max="50"
                                step="0.1"
                            />
                            <span className="text-gray-600 font-medium">%</span>
                        </div>
                    </div>

                    {adjustForInflation && (
                        <p className="text-sm text-gray-600 italic">
                            Inflation applied annually to: <strong>Revenue, COGS, Operating Expenses, and CapEx</strong>
                        </p>
                    )}
                </div>

                {!budget ? (
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 text-center">
                        <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">No Budget Created Yet</h3>
                        <p className="text-gray-600">Set your financial targets for the year to get started.</p>
                    </div>
                ) : (
                    <>
                        {/* Main Table */}
                        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 overflow-hidden mb-8">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10">
                                            <th className="px-8 py-6 text-left text-sm font-semibold text-gray-700">Category</th>
                                            <th className="px-8 py-6 text-right text-sm font-semibold text-gray-700">
                                                Budget {adjustForInflation && "(Inflation-Adjusted)"}
                                            </th>
                                            <th className="px-8 py-6 text-right text-sm font-semibold text-gray-700">Actual</th>
                                            <th className="px-8 py-6 text-right text-sm font-semibold text-gray-700">Difference</th>
                                            <th className="px-8 py-6 text-center text-sm font-semibold text-gray-700">Variance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200/60">
                                        {budgetRows.map((row, i) => {
                                            // Properly extract the original budgeted amount based on label
                                            const getOriginalBudgeted = () => {
                                                if (!budget) return 0;
                                                switch (row.label) {
                                                    case "Revenue": return budget.revenue?.budgetedAmount || 0;
                                                    case "COGS": return budget.cogs?.budgetedAmount || 0;
                                                    case "Operating Expenses": return budget.operatingExpenses?.budgetedAmount || 0;
                                                    case "Net Income": return budget.netIncome?.budgetedAmount || 0;
                                                    case "Capex": return budget.capex?.budgetedAmount || 0;
                                                    case "Cash Inflows": return budget.cashInflows?.budgetedAmount || 0;
                                                    case "Cash Outflows": return budget.cashOutflows?.budgetedAmount || 0;
                                                    default: return 0;
                                                }
                                            };

                                            const originalBudgeted = getOriginalBudgeted();

                                            // Apply inflation only if toggle is on AND this row should be inflated
                                            const displayBudgeted = row.applyInflation && adjustForInflation
                                                ? Math.round(originalBudgeted * (1 + inflationRate / 100))
                                                : originalBudgeted;

                                            const diff = row.actual - displayBudgeted;
                                            const isFavorable = row.favorableWhen === "higher" ? diff >= 0 : diff <= 0;
                                            const absDiff = Math.abs(diff);

                                            return (
                                                <tr key={i} className="hover:bg-white/50 transition-colors">
                                                    <td className="px-8 py-6 flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${isFavorable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {row.icon}
                                                        </div>
                                                        <span className="font-medium text-gray-800">{row.label}</span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right font-semibold text-gray-700">{fmt(displayBudgeted)}</td>
                                                    <td className="px-8 py-6 text-right font-semibold text-gray-900">{fmt(row.actual)}</td>
                                                    <td className={`px-8 py-6 text-right font-bold ${diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {diff >= 0 ? '+' : '-'}{fmt(absDiff)}
                                                    </td>
                                                    <td className="px-8 py-6 text-center">
                                                        {isFavorable ? (
                                                            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium text-sm">
                                                                <TrendingUp className="w-4 h-4" /> Favorable
                                                            </div>
                                                        ) : (
                                                            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-800 font-medium text-sm">
                                                                <TrendingDown className="w-4 h-4" /> Unfavorable
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Assumptions Section (unchanged) */}
                        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/40 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                    <Info className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Calculation Assumptions & Methodology
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Revenue</h4>
                                        <p className="text-sm leading-relaxed">Sales Revenue - Sales returns</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">COGS</h4>
                                        <p className="text-sm leading-relaxed">-</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Operating Expenses</h4>
                                        <p className="text-sm leading-relaxed">-</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Net Income</h4>
                                        <p className="text-sm leading-relaxed">-</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Capex</h4>
                                        <p className="text-sm leading-relaxed">Total net fixed assets used (proxy until direct tracking)</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Cash Inflows / Outflows</h4>
                                        <p className="text-sm leading-relaxed">-</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Variance Logic</h4>
                                        <p className="text-sm leading-relaxed">
                                            Green = Favorable<br />
                                            • Revenue & Income: Actual ≥ Budget<br />
                                            • All Expenses & Outflows: Actual ≤ Budget
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200/60 flex items-center gap-2 text-sm text-gray-500">
                                <Info className="w-4 h-4" />
                                <span>Data is calculated in real-time from journal entries. Last updated: {new Date().toLocaleString()}</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Budget;