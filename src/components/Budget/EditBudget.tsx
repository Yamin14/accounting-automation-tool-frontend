import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import useAlertStore from '../../store/alertStore';
import useAccountingStore from '../../store/accountingStore';
import Spinner from '../Layout/Spinner';

const EditBudget = () => {
  const navigate = useNavigate();
  const { addAlert } = useAlertStore();
  const { activeFinancialYear } = useAccountingStore();
  const [loading, setLoading] = useState(true);

   const [formData, setFormData] = useState({
      revenue: '',
      cogs: '',
      operatingExpenses: '',
      capex: '',
      cashInflows: '',
      cashOutflows: '',
      netIncome: '',
    });

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        setLoading(true);
        const res = await api.get('/budgets/current');
        const budget = res.data.budget;
        console.log(budget);

        setFormData({
          revenue: budget.revenue.budgetedAmount ?? 0,
          cogs: budget.cogs.budgetedAmount ?? 0,
          operatingExpenses: budget.operatingExpenses.budgetedAmount ?? 0,
          capex: budget.capex.budgetedAmount ?? 0,
          cashInflows: budget.cashInflows.budgetedAmount ?? 0,
          cashOutflows: budget.cashOutflows.budgetedAmount ?? 0,
          netIncome: budget.netIncome.budgetedAmount ?? 0,
        });
      } catch (err) {
        addAlert('Failed to load budget', 'error');
        navigate('/budget');
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, [addAlert, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;

    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === '' ? 0 : Number(value), 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      setLoading(true);
      await api.put('/budgets/current', formData);
      addAlert('Budget updated successfully!', 'success');
      navigate('/budget');
    } catch (err) {
      addAlert('Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Show spinner while loading or if no data (shouldn't happen after load)
  if (loading || !formData) {
    return <Spinner />;
  }

  const fields = [
    { label: 'Revenue Target', name: 'revenue' as const },
    { label: 'Cost of Goods Sold (COGS)', name: 'cogs' as const },
    { label: 'Operating Expenses', name: 'operatingExpenses' as const },
    { label: 'Capital Expenditure (CapEx)', name: 'capex' as const },
    { label: 'Cash Inflows', name: 'cashInflows' as const },
    { label: 'Cash Outflows', name: 'cashOutflows' as const },
    { label: 'Target Net Income', name: 'netIncome' as const },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5 pointer-events-none"></div>
      <div className="relative max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/budget')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-8">
            Edit Annual Budget
          </h1>

          <h2 className="text-lg text-gray-700 mb-6">
            Financial Year: <span className="font-semibold">{activeFinancialYear?.name || 'N/A'}</span>
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {field.label}
                </label>
                <input
                  type="number"
                  name={field.name}
                  value={typeof formData[field.name] === 'number' ? formData[field.name].toString() : '0'}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all duration-200 bg-white/50 backdrop-blur-sm text-lg"
                />
              </div>
            ))}

            <div className="md:col-span-2 flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate('/budget')}
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Saving...' : 'Update Budget'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBudget;