import React from 'react';

interface TrialBalanceItem {
  account: string;
  debit: number;
  credit: number;
  category: string;
}

interface TrialBalanceTableProps {
  trialBalanceData: TrialBalanceItem[];
  totalDebits: number;
  totalCredits: number;
}

const TrialBalanceTable: React.FC<TrialBalanceTableProps> = ({
  trialBalanceData,
  totalDebits,
  totalCredits
}) => {
  const getAccountTypeColor = (accountName: string) => {
    const account = trialBalanceData.find(item => item.account === accountName);
    if (!account) return 'text-gray-700';
    
    if (accountName.includes('Revenue') || accountName.includes('Capital')) return 'text-green-700';
    if (accountName.includes('Expense')) return 'text-red-700';
    if (accountName.includes('Asset') || accountName.includes('Cash') || accountName.includes('Bank') || 
        accountName.includes('Receivable') || accountName.includes('Inventory') || 
        accountName.includes('Equipment')) return 'text-blue-700';
    if (accountName.includes('Payable') || accountName.includes('Loan')) return 'text-purple-700';
    
    return 'text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Trial Balance as of {new Date().toLocaleDateString('en-GB')}
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account Name
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Debit (PKR)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credit (PKR)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trialBalanceData
              .filter(item => item.debit > 0 || item.credit > 0)
              .map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getAccountTypeColor(item.account)}`}>
                  {item.account}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono">
                  {item.debit > 0 ? item.debit.toLocaleString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono">
                  {item.credit > 0 ? item.credit.toLocaleString() : '-'}
                </td>
              </tr>
            ))}
            
            {/* Total Row */}
            <tr className="bg-gray-50 border-t-2 border-gray-300">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                TOTAL
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold font-mono text-blue-600">
                {totalDebits.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold font-mono text-purple-600">
                {totalCredits.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrialBalanceTable;