import React, { useState, useMemo } from 'react';
import { Calculator, Filter } from 'lucide-react';
import SetFinancialYear from '../SetFinancialYear';
import TAccount from './TAccount';
import useAccountingStore from '../../../store/accountingStore';

const Ledgers: React.FC = () => {
  const { accounts, journalEntries } = useAccountingStore();
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('All');

  // ✅ Build ledgerAccounts dynamically from journalEntries
  const ledgerAccounts = useMemo(() => {
    const ledgerMap: Record<string, any> = {};

    // Initialize from available accounts
    accounts.forEach(acc => {
      ledgerMap[acc.accountName] = {
        name: acc.accountName,
        type: acc.category,
        entries: [],
        balance: 0,
      };
    });

    // Process each journal entry into both accounts
    journalEntries.forEach(entry => {
      const { debitAccount, creditAccount, amount, date, description } = entry;

      // Debit side
      if (ledgerMap[debitAccount.accountName]) {
        const acc = ledgerMap[debitAccount.accountName];
        acc.balance += amount;
        acc.entries.push({
          date,
          description,
          debit: amount,
          credit: null,
          balance: acc.balance,
        });
      }

      // Credit side
      if (ledgerMap[creditAccount.accountName]) {
        const acc = ledgerMap[creditAccount.accountName];
        acc.balance -= amount;
        acc.entries.push({
          date,
          description,
          debit: null,
          credit: amount,
          balance: acc.balance,
        });
      }
    });

    // Sort each account’s entries by date
    Object.values(ledgerMap).forEach(acc => {
      acc.entries.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });

    return Object.values(ledgerMap);
  }, [accounts, journalEntries]);

  // filter
  const filteredAccounts = ledgerAccounts.filter(account => {
    if (filterType === 'All') return true;
    return account.type === filterType;
  });

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'Asset': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Liability': return 'text-red-600 bg-red-50 border-red-200';
      case 'Equity': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Revenue': return 'text-green-600 bg-green-50 border-green-200';
      case 'Expense': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const capitalize = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);

  const selectedAccountData = selectedAccount
    ? ledgerAccounts.find(acc => acc.name === selectedAccount)
    : null;

  // return
  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">General Ledger</h1>
          <p className="text-gray-600">
            T-Account view of all accounts with running balances and transaction history
          </p>
        </div>
        <div className="lg:mt-0">
          <SetFinancialYear />
        </div>
      </div>

      {/* Account Type Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Filter by Account Type</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', 'Asset', 'Liability', 'Equity', 'Revenue', 'Expense'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg capitalize font-medium transition-colors ${filterType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {type === 'All' ? 'All Accounts' : `${type}s`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Accounts ({filteredAccounts.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredAccounts.map((account) => (
                <button
                  key={account.name}
                  onClick={() => setSelectedAccount(account.name)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${selectedAccount === account.name ? 'bg-blue-50 border-r-4 border-blue-600' : ''
                    }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900">{account.name}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border capitalize ${getAccountTypeColor(
                        account.type
                      )}`}
                    >
                      {capitalize(account.type)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {account.entries.length} transactions
                    </span>
                    <span
                      className={`font-bold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                      PKR {Math.abs(account.balance).toLocaleString()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="lg:col-span-2">
          {selectedAccountData ? (
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedAccountData.name}
                    </h2>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full border capitalize ${getAccountTypeColor(
                        selectedAccountData.type
                      )}`}
                    >
                      {capitalize(selectedAccountData.type)} Account
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">
                      Current Balance
                    </p>
                    <p
                      className={`text-2xl font-bold ${selectedAccountData.balance >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                        }`}
                    >
                      PKR {Math.abs(selectedAccountData.balance).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* ✅ T-Account Component */}
              <TAccount account={selectedAccountData} />

            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select an Account
              </h3>
              <p className="text-gray-500">
                Choose an account from the list to view its ledger details and
                transaction history.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ledgers;
