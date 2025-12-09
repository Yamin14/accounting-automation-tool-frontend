import { useState } from 'react';
import { FileText, Calendar, DollarSign, Search } from 'lucide-react';
import useAccountingStore from '../../store/accountingStore';
import SetFinancialYear from './SetFinancialYear';

const JournalEntries = () => {
  const { journalEntries } = useAccountingStore();

  // filter
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.debitAccount.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.creditAccount.accountName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || entry.date.includes(dateFilter);
    return matchesSearch && matchesDate;
  });

  const totalTransactions = filteredEntries.length;
  const totalAmount = filteredEntries.reduce((sum, entry) => sum + entry.amount, 0);

  // return
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Journal Entries</h1>
          <p className="text-gray-600">
            Complete record of all transactions posted in chronological order (IFRS/IAS compliant)
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Entries</p>
                <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">PKR {totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredEntries.filter(e =>
                    new Date(e.date).getMonth() === new Date().getMonth()
                  ).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <SetFinancialYear />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by description or account..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Journal Entries */}
        <div className="bg-white rounded-lg shadow-md">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No journal entries found</h3>
              <p className="text-gray-500">
                {journalEntries.length === 0
                  ? 'Start by adding your first transaction.'
                  : 'Try adjusting your search or date filters.'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Journal Entries ({filteredEntries.length} entries)
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredEntries.map((entry) => (
                  <div key={entry._id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium text-gray-500 mr-4">
                            {new Date(entry.date).toLocaleDateString('en-GB')}
                          </span>
                          <span className="text-sm text-gray-400">Entry #{entry._id.split('_')[1]}</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">{entry.description}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          PKR {entry.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                      <div className="grid grid-cols-3 gap-4 mb-2 font-bold border-b border-gray-300 pb-2">
                        <span>Account</span>
                        <span className="text-right">Debit (PKR)</span>
                        <span className="text-right">Credit (PKR)</span>
                      </div>

                      {/* Debit Entry */}
                      <div className="grid grid-cols-3 gap-4 py-1">
                        <span className="font-medium">{entry.debitAccount.accountName}</span>
                        <span className="text-right">{entry.amount.toLocaleString()}</span>
                        <span className="text-right">-</span>
                      </div>

                      {/* Credit Entry */}
                      <div className="grid grid-cols-3 gap-4 py-1">
                        <span className="pl-4">{entry.creditAccount.accountName}</span>
                        <span className="text-right">-</span>
                        <span className="text-right">{entry.amount.toLocaleString()}</span>
                      </div>


                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* IFRS Compliance Note */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">IFRS/IAS Compliance</h3>
          <p className="text-sm text-blue-800">
            All journal entries follow the double-entry bookkeeping system as required by IFRS standards.
            Each transaction maintains the accounting equation: Assets = Liabilities + Equity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JournalEntries;