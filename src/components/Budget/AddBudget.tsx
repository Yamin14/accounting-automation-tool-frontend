import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router';
import api from '../../api/api';
import useAlertStore from '../../store/alertStore';
import useAccountingStore from '../../store/accountingStore';
import Spinner from '../Layout/Spinner';

const AddBudget = () => {
  const navigate = useNavigate();
  const { addAlert } = useAlertStore();
  const { activeFinancialYear } = useAccountingStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    revenue: '',
    cogs: '',
    operatingExpenses: '',
    capex: '',
    cashInflows: '',
    cashOutflows: '',
    netIncome: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/budgets', formData);
      addAlert('Budget created successfully!', "success");
      navigate('/budget');
    } catch (error) {
      addAlert('Failed to create budget', "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }
  
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
            Create Annual Budget
          </h1>

          <h2 className="text-lg text-gray-700 mb-6">
            Financial Year: <span className="font-semibold">{activeFinancialYear?.name || "Error"}</span>
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Revenue Target', name: 'revenue', icon: 'trending-up' },
              { label: 'Cost of Goods Sold (COGS)', name: 'cogs', icon: 'package' },
              { label: 'Operating Expenses', name: 'operatingExpenses', icon: 'building' },
              { label: 'Capital Expenditure (CapEx)', name: 'capex', icon: 'hard-hat' },
              { label: 'Cash Inflows', name: 'cashInflows', icon: 'arrow-down-circle' },
              { label: 'Cash Outflows', name: 'cashOutflows', icon: 'arrow-up-circle' },
              { label: 'Target Net Income', name: 'netIncome', icon: 'dollar-sign' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{field.label}</label>
                <input
                  type="number"
                  name={field.name}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all duration-200 bg-white/50 backdrop-blur-sm text-lg"
                  placeholder="0"
                />
              </div>
            ))}

            <div className="md:col-span-2 flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate('budget')}
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <Save className="w-5 h-5" />
                Save Budget
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBudget;