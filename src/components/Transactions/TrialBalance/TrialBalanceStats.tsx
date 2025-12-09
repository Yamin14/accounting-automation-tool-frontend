import React from 'react';
import { PieChart, CheckCircle, AlertCircle } from 'lucide-react';

interface TrialBalanceStatsProps {
  isBalanced: boolean;
  totalDebits: number;
  totalCredits: number;
}

const TrialBalanceStats: React.FC<TrialBalanceStatsProps> = ({
  isBalanced,
  totalDebits,
  totalCredits
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          {isBalanced ? (
            <CheckCircle className="h-8 w-8 text-green-600" />
          ) : (
            <AlertCircle className="h-8 w-8 text-red-600" />
          )}
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p className={`text-lg font-bold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
              {isBalanced ? 'Balanced' : 'Unbalanced'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <PieChart className="h-8 w-8 text-blue-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Debits</p>
            <p className="text-lg font-bold text-blue-600">
              PKR {totalDebits.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <PieChart className="h-8 w-8 text-purple-600" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Credits</p>
            <p className="text-lg font-bold text-purple-600">
              PKR {totalCredits.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
            isBalanced ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <span className={`text-sm font-bold ${
              isBalanced ? 'text-green-600' : 'text-red-600'
            }`}>
              {isBalanced ? '✓' : '✗'}
            </span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Difference</p>
            <p className={`text-lg font-bold ${
              Math.abs(totalDebits - totalCredits) < 0.01 ? 'text-green-600' : 'text-red-600'
            }`}>
              PKR {Math.abs(totalDebits - totalCredits).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialBalanceStats;