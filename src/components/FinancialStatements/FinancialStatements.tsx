import { useMemo } from 'react';
import { FileText, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import SetFinancialYear from '../Transactions/SetFinancialYear';
import ProfitLossStatement from './ProfitLossStatement';
import EquityStatement from './EquityStatement';
import CashFlowStatement from './CashFlowStatement';
import BalanceSheet from './BalanceSheet';
import useAccountingStore from '../../store/accountingStore';
import { calculateTotals } from '../../utils/CalculateTotals';
import ComprehensiveIncome from './ComprehensiveIncome';
import useFinancialStatementStore from '../../store/financialStatementStore';

// Main FinancialStatements Component
const FinancialStatements = () => {
  const { journalEntries } = useAccountingStore();
  const { financialStatement, setFinancialStatement } = useFinancialStatementStore();

  // calculate totals
  const { netIncome, assets, liabilities, totalEquity } = useMemo(
    () => calculateTotals(journalEntries),
    [journalEntries]
  );

  // return
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Statements</h1>
          <p className="text-gray-600">Complete set of IFRS/IAS compliant financial statements</p>
        </div>

        <div className="mb-6">
          <SetFinancialYear />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Net Income</p>
                <p className={`text-xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  PKR {Math.abs(netIncome).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Assets</p>
                <p className="text-xl font-bold text-blue-600">PKR {assets.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Liabilities</p>
                <p className="text-xl font-bold text-purple-600">PKR {liabilities.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Equity</p>
                <p className="text-xl font-bold text-indigo-600">PKR {totalEquity.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label htmlFor="statement-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Financial Statement
          </label>
          <select
            id="statement-select"
            value={financialStatement}
            onChange={(e) => setFinancialStatement(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
          >
            <option value="pnl">Profit & Loss Statement</option>
            <option value="ci">Statement of Comprehensive Income</option>
            <option value="balance">Balance Sheet</option>
            <option value="cashflow">Cash Flow Statement</option>
            <option value="equity">Statement of Changes in Equity</option>
          </select>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          {financialStatement === 'pnl' && (
            <ProfitLossStatement />
          )}
          {financialStatement === 'ci' && (
            <ComprehensiveIncome />
          )}
          {financialStatement === 'balance' && (
            <BalanceSheet />
          )}
          {financialStatement === 'cashflow' && (
            <CashFlowStatement />
          )}
          {financialStatement === 'equity' && (
            <EquityStatement />
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">IFRS/IAS Compliance</h3>
          <p className="text-sm text-blue-800">
            These financial statements are prepared in accordance with International Financial Reporting Standards (IFRS) 
            and International Accounting Standards (IAS), including IAS 1 (Presentation of Financial Statements), 
            IAS 7 (Statement of Cash Flows), and other relevant standards.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialStatements;