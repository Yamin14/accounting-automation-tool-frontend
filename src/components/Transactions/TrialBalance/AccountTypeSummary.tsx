import { useMemo } from 'react';
import useAccountingStore from '../../../store/accountingStore';
import { calculateTotals } from '../../../utils/CalculateTotals';

const AccountTypeSummary = () => {
  const { journalEntries } = useAccountingStore();
  const { totals } = useMemo(() => {
    const totals = calculateTotals(journalEntries);
    return { totals };
  }, [journalEntries])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">Assets</h3>
        <p className="text-2xl font-bold text-blue-700">
          PKR {totals.assets.toLocaleString()}
        </p>
      </div>
      
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <h3 className="font-medium text-purple-900 mb-2">Liabilities</h3>
        <p className="text-2xl font-bold text-purple-700">
          PKR {totals.liabilities.toLocaleString()}
        </p>
      </div>
      
      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
        <h3 className="font-medium text-indigo-900 mb-2">Equity</h3>
        <p className="text-2xl font-bold text-indigo-700">
          PKR {totals.totalEquity.toLocaleString()}
        </p>
      </div>
      
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <h3 className="font-medium text-green-900 mb-2">Revenue</h3>
        <p className="text-2xl font-bold text-green-700">
          PKR {totals.revenue.toLocaleString()}
        </p>
      </div>
      
      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
        <h3 className="font-medium text-red-900 mb-2">Expenses</h3>
        <p className="text-2xl font-bold text-red-700">
          PKR {totals.expenses.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default AccountTypeSummary;