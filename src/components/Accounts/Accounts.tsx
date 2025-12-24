import { useState, useMemo } from 'react';
import { Plus, Edit2, Wallet, Filter } from 'lucide-react';
import { Link } from 'react-router';
import useAuthStore from '../../store/authStore';
import useAccountingStore from '../../store/accountingStore';

const Accounts = () => {
  const { accounts } = useAccountingStore();
  const [financialStatementFilter, setFinancialStatementFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [subcategoryFilter, setSubcategoryFilter] = useState('All');

  const { user } = useAuthStore();

  // filter accounts based on selected filters
  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      return (
        (financialStatementFilter === 'All' || acc.financialStatement === financialStatementFilter) &&
        (categoryFilter === 'All' || acc.category === categoryFilter) &&
        (subcategoryFilter === 'All' || acc.subCategory === subcategoryFilter)
      );
    });
  }, [accounts, financialStatementFilter, categoryFilter, subcategoryFilter]);
  
  // derive unique filter options
  const uniqueFinancialStatements = useMemo(
    () => ['All', ...new Set(accounts.map(acc => acc.financialStatement))],
    [accounts]
  );
  const uniqueCategories = useMemo(
    () => ['All', ...new Set(accounts.map(acc => acc.category))],
    [accounts]
  );
  const uniqueSubcategories = useMemo(
    () => ['All', ...new Set(accounts.map(acc => acc.subCategory))],
    [accounts]
  );  

  // return
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl">
              <Wallet className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Chart of Accounts
              </h1>
              <p className="text-gray-600 mt-1">Manage your financial accounts</p>
            </div>
          </div>
          <Link
            to="/accounts/add"
            className="inline-flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add Account
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filter Accounts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Financial Statement
              </label>
              <select
                value={financialStatementFilter}
                onChange={(e) => setFinancialStatementFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
              >
                {uniqueFinancialStatements.map(fs => (
                  <option key={fs} value={fs}>{fs}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
              >
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subcategory</label>
              <select
                value={subcategoryFilter}
                onChange={(e) => setSubcategoryFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
              >
                {uniqueSubcategories.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Account Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Financial Statement</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Subcategory</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Balance (PKR)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAccounts.map((account) => (
                  <tr key={account._id} className="hover:bg-blue-50/50 transition-all duration-200">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <Link to={`/accounts/${account._id}`}>{account.accountName}</Link></td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        account.accountType === 'debit'
                          ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800'
                          : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800'
                      }`}>
                        {account.accountType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{account.financialStatement}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{account.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{account.subCategory}</td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {account.balance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {user.role === 'admin' &&
                      <Link
                        to={`/admin/accounts/${account._id}/edit`}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </Link>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
