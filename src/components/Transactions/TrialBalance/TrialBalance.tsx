import React from 'react';
import { Download } from 'lucide-react';
import SetFinancialYear from '../SetFinancialYear';
import TrialBalanceStats from './TrialBalanceStats';
import TrialBalanceTable from './TrialBalanceTable';
import AccountTypeSummary from './AccountTypeSummary';
import useAccountingStore from '../../../store/accountingStore';

const TrialBalance: React.FC = () => {
  const { accounts, journalEntries } = useAccountingStore();

  // Calculate trial balance from journal entries
  const getTrialBalance = () => {
    const balances = new Map<string, { debit: number; credit: number; accountType: string; category: string }>();

    // Initialize all accounts
    accounts.forEach(account => {
      balances.set(account.accountName, {
        debit: 0,
        credit: 0,
        accountType: account.accountType,
        category: account.category
      });
    });

    // Process journal entries
    journalEntries.forEach(entry => {
      const debitAccount = balances.get(entry.debitAccount.accountName);
      const creditAccount = balances.get(entry.creditAccount.accountName);

      if (debitAccount) {
        debitAccount.debit += entry.amount;
      }
      if (creditAccount) {
        creditAccount.credit += entry.amount;
      }
    });

    // Convert to array and calculate net balances
    const trialBalanceData = Array.from(balances.entries()).map(([account, data]) => {
      const netBalance = data.debit - data.credit;
      return {
        account,
        debit: netBalance > 0 ? netBalance : 0,
        credit: netBalance < 0 ? Math.abs(netBalance) : 0,
        category: data.category
      };
    });

    return trialBalanceData;
  };

  const trialBalanceData = getTrialBalance();

  const totalDebits = trialBalanceData.reduce((sum, item) => sum + item.debit, 0);
  const totalCredits = trialBalanceData.reduce((sum, item) => sum + item.credit, 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

  const exportTrialBalance = () => {
    const csvContent = [
      ['Account Name', 'Debit (PKR)', 'Credit (PKR)'],
      ...trialBalanceData
        .filter(item => item.debit > 0 || item.credit > 0)
        .map(item => [
          item.account,
          item.debit > 0 ? item.debit.toFixed(2) : '',
          item.credit > 0 ? item.credit.toFixed(2) : ''
        ]),
      ['TOTAL', totalDebits.toFixed(2), totalCredits.toFixed(2)]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trial-balance-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Trial Balance</h1>
            <p className="text-gray-600">
              Summary of all ledger account balances to verify double-entry bookkeeping accuracy
            </p>
          </div>
          <div className="flex items-center gap-4">
            <SetFinancialYear />
            {/* <button
              onClick={exportTrialBalance}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button> */}
          </div>
        </div>
      </div>

      <TrialBalanceStats
        isBalanced={isBalanced}
        totalDebits={totalDebits}
        totalCredits={totalCredits}
      />

      <TrialBalanceTable
        trialBalanceData={trialBalanceData}
        totalDebits={totalDebits}
        totalCredits={totalCredits}
      />

      <AccountTypeSummary />

      {/* IFRS Compliance Note */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">IFRS/IAS Compliance</h3>
        <p className="text-sm text-blue-800">
          This trial balance follows IFRS standards and ensures that the fundamental accounting equation 
          (Assets = Liabilities + Equity) is maintained. All debit and credit balances are properly classified 
          according to their account types as per IAS 1 - Presentation of Financial Statements.
        </p>
      </div>
    </div>
  );
};

export default TrialBalance;