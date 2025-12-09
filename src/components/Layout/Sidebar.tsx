import { NavLink } from 'react-router-dom';
import {
  Calculator,
  TrendingUp,
  FileText,
  PieChart,
  X,
  Plus,
  Activity,
  LogOut,
  Wallet,
  BookOpenText,
  CheckCircle2,
  PiggyBank
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { useState } from 'react';
import api from '../../api/api';
import useAlertStore from '../../store/alertStore';
import Spinner from './Spinner';
import useAccountingStore from '../../store/accountingStore';
import useNotesStore from '../../store/notesStore';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { addAlert } = useAlertStore();
  const { clearAccounts } = useAccountingStore();
  const { clearNotes } = useNotesStore();

  // navigation
  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp, color: 'text-blue-600', path: '/dashboard' },
    { id: 'health', name: 'Financial Health', icon: Activity, color: 'text-emerald-600', path: '/financial-health' },
    
    { id: 'transactions', name: 'Add Transaction', icon: Plus, color: 'text-green-600', path: '/add-transaction' },
    { id: 'journal', name: 'Journal Entries', icon: FileText, color: 'text-purple-600', path: '/journal' },
    { id: 'ledgers', name: 'Ledgers', icon: Calculator, color: 'text-orange-600', path: '/ledgers' },
    { id: 'trial', name: 'Trial Balance', icon: PieChart, color: 'text-pink-600', path: '/trial-balance' },
    { id: 'statements', name: 'Financial Statements', icon: FileText, color: 'text-indigo-600', path: '/financial-statements' },
    
    { id: 'accounts', name: 'Accounts', icon: Wallet, color: 'text-teal-600', path: '/accounts' },
    { id: 'notes', name: 'Notes', icon: BookOpenText, color: 'text-teal-600', path: '/notes' },
    { id: 'shariah', name: 'Shariah Compliance', icon: CheckCircle2, color: 'text-teal-600', path: '/shariah-compliance' },
    
    { id: 'budget', name: 'Budget', icon: PiggyBank, color: 'text-teal-600', path: '/budget' },
    
  ];

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
      logout();
      clearAccounts();
      clearNotes();
      addAlert("Logged out successfully", "success");
    } catch (error) {
      addAlert("Logout failed", "error");
      return;
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div
          className={`fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Accounting Bot</span>
            </div>

            {/* User Profile - Mobile */}
            <div className="px-4 mt-6 mb-4">
              <div className="flex items-center p-3 bg-white/60 rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-600 truncate">{user.company.companyName}</p>
                </div>
              </div>
            </div>

            <nav className="mt-8 px-3 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `group flex items-center px-4 py-3 text-sm font-medium rounded-xl w-full text-left transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105'
                          : 'text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-md hover:transform hover:scale-102'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`mr-3 h-5 w-5 ${
                            isActive ? 'text-white' : `${item.color} group-hover:${item.color}`
                          }`}
                        />
                        {item.name}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Logout Button - Mobile */}
            <div className="px-3 mt-6">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl w-full transition-all duration-200"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-xl">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                <Calculator className="h-7 w-7 text-white" />
              </div>
              <div className="ml-4">
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Accounting Bot
                </span>
                <p className="text-xs text-gray-500 mt-1">AI-Powered IFRS Compliance</p>
              </div>
            </div>

            {/* User Profile - Desktop */}
            <div className="px-6 mb-6">
              <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-blue-600 truncate font-medium">{user.company.companyName}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex items-center px-4 py-3 text-sm font-medium rounded-xl w-full text-left transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105'
                          : 'text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-md hover:transform hover:scale-102'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`mr-3 h-5 w-5 ${
                            isActive ? 'text-white' : `${item.color} group-hover:${item.color}`
                          }`}
                        />
                        {item.name}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Logout Button - Desktop */}
            <div className="px-4 pb-4">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl w-full transition-all duration-200"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
