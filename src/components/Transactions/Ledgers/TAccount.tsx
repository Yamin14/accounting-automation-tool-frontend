import React from 'react';

interface Entry {
  date: string;
  description: string;
  debit: number | null;
  credit: number | null;
  balance: number;
}

interface Account {
  name: string;
  type: string;
  entries: Entry[];
  balance: number;
}

interface Props {
  account: Account;
}

const TAccount: React.FC<Props> = ({ account }) => {
  return (
    <div className="p-6">
      {/* T-Account View */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-center text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300">
          {account.name}
        </h3>

        <div className="grid grid-cols-2 gap-0 border border-gray-300 rounded">
          {/* Debit Side */}
          <div className="border-r border-gray-300">
            <div className="bg-gray-100 p-3 text-center font-bold border-b border-gray-300">
              Debit
            </div>
            <div className="p-3 space-y-2 min-h-48 max-h-64 overflow-y-auto">
              {account.entries
                .filter((entry) => entry.debit)
                .map((entry, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-600">
                      {new Date(entry.date).toLocaleDateString('en-GB')}
                    </span>
                    <span className="font-medium">
                      {entry.debit?.toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Credit Side */}
          <div>
            <div className="bg-gray-100 p-3 text-center font-bold border-b border-gray-300">
              Credit
            </div>
            <div className="p-3 space-y-2 min-h-48 max-h-64 overflow-y-auto">
              {account.entries
                .filter((entry) => entry.credit)
                .map((entry, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-600">
                      {new Date(entry.date).toLocaleDateString('en-GB')}
                    </span>
                    <span className="font-medium">
                      {entry.credit?.toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="mt-4 text-center">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-900 font-bold rounded">
            Balance: PKR {Math.abs(account.balance).toLocaleString()}
            {account.balance >= 0 ? ' Dr' : ' Cr'}
          </span>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Transaction History
        </h3>
        {account.entries.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No transactions recorded for this account.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Debit
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credit
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {account.entries.map((entry, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(entry.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {entry.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                      {entry.debit ? `PKR ${entry.debit.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                      {entry.credit ? `PKR ${entry.credit.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold">
                      PKR {Math.abs(entry.balance).toLocaleString()}
                      {entry.balance >= 0 ? ' Dr' : ' Cr'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TAccount;
