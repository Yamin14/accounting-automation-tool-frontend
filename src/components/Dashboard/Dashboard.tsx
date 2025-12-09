import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3 } from 'lucide-react';
import useCalculationsStore from '../../store/calculationsStore';
import useAccountingStore from '../../store/accountingStore';

const Dashboard: React.FC = () => {
  const { totals } = useCalculationsStore();
  const { journalEntries } = useAccountingStore();
  
  const { totalEquity, stats, netIncome } = useMemo(() => {
    const netIncome = totals.netIncome;
    const totalEquity = totals.totalEquity;

    const stats = [
      {
        name: 'Total Assets',
        value: `PKR ${totals.assets.toLocaleString()}`,
        icon: TrendingUp,
        changeType: 'positive',
      },
      {
        name: 'Total Liabilities',
        value: `PKR ${totals.liabilities.toLocaleString()}`,
        icon: TrendingDown,
        changeType: 'negative',
      },
      {
        name: 'Net Income',
        value: `PKR ${netIncome.toLocaleString()}`,
        icon: DollarSign,
        changeType: 'positive',
      },
      {
        name: 'Total Transactions',
        value: journalEntries.length.toString(),
        icon: BarChart3,
        changeType: 'neutral',
      },
    ];

    return { totalEquity, stats, netIncome };

  }, [totals, journalEntries.length]);

  return (
    <div>
      <div className="mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Financial Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time overview of your accounting data and key financial metrics with IFRS compliance
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-white/20 hover:shadow-2xl hover:transform hover:scale-105 transition-all duration-300">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-xl ${item.changeType === 'positive' ? 'bg-green-100' :
                        item.changeType === 'negative' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                      <Icon className={`h-6 w-6 ${item.changeType === 'positive' ? 'text-green-600' :
                          item.changeType === 'negative' ? 'text-red-600' : 'text-blue-600'
                        }`} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-semibold text-gray-500 truncate uppercase tracking-wide">{item.name}</dt>
                      <dd className="text-2xl font-bold text-gray-900 mt-1">{item.value}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Balance Sheet Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full mr-3"></div>
            Balance Sheet Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-600">Total Assets</span>
              <span className="text-lg font-bold text-blue-600">PKR {totals.assets.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-600">Total Liabilities</span>
              <span className="text-lg font-bold text-red-600">PKR {totals.liabilities.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-600">Total Equity</span>
              <span className="text-lg font-bold text-purple-600">PKR {totalEquity.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 rounded-xl mt-4">
              <span className="text-sm font-bold text-blue-900">Balance Check</span>
              <span className={`text-sm font-bold ${Math.abs(totals.assets - (totals.liabilities + totalEquity)) < 1 ? 'text-green-600' : 'text-red-600'
                }`}>
                {Math.abs(totals.assets - (totals.liabilities + totalEquity)) < 1 ? 'Balanced ✓' : 'Unbalanced ⚠'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full mr-3"></div>
            Profit & Loss Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-600">Revenue</span>
              <span className="text-lg font-bold text-green-600">PKR {totals.revenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-600">Expenses</span>
              <span className="text-lg font-bold text-red-600">PKR {totals.expenses.toLocaleString()}</span>
            </div>
            <div className={`flex justify-between items-center py-3 px-4 rounded-xl mt-4 ${netIncome >= 0 ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-gradient-to-r from-red-50 to-pink-50'
              }`}>
              <span className={`text-sm font-bold ${netIncome >= 0 ? 'text-green-900' : 'text-red-900'}`}>Net Income</span>
              <span className={`text-sm font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                PKR {netIncome.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></div>
            Recent Transactions
          </h2>
        </div>
        <div className="p-6">
          {journalEntries.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PieChart className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
              <p className="text-gray-500">Add your first transaction to get started with AI-powered accounting!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Accounts</th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-gray-100">
                  {journalEntries.slice(0, 5).map((entry) => (
                    <tr key={entry._id} className="hover:bg-white/80 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{entry.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        PKR {entry.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {entry.debitAccount.accountName + ", " + entry.creditAccount.accountName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;