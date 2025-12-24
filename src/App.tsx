import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react';
import useAuthStore from './store/authStore';
import api from './api/api';

import Layout from './components/Layout/Layout'
import Dashboard from './components/Dashboard/Dashboard';
import Spinner from './components/Layout/Spinner';
import Alert from './components/Layout/Alert';
import FinancialHealth from './components/FinancialHealth/FinancialHealth';
import FinancialStatements from './components/FinancialStatements/FinancialStatements';
import Accounts from './components/Accounts/Accounts';
import AddAccount from './components/Accounts/AddAcount';
import EditAccount from './components/Accounts/EditAccount';
import Company from './components/Auth/Company';
import Profile from './components/Auth/Profile';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import JournalEntries from './components/Transactions/JournalEntries';
import TransactionInput from './components/Transactions/TransactionInput';
import Ledgers from './components/Transactions/Ledgers/Ledgers';
import TrialBalance from './components/Transactions/TrialBalance/TrialBalance';
import AdminRoute from './components/Auth/AdminRoute';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import GuestRoute from './components/Auth/GuestRoute';
import Admin from './components/Admin/Admin';
import NotFound from './components/Layout/NotFound';
import AccountDetails from './components/Accounts/AccountDetails';
import UserManagement from './components/Admin/UserManagement';
import FinancialYears from './components/Admin/FinancialYears';
import AddFinancialYear from './components/Admin/AddFinancialYear';
import CloseFinancialYear from './components/Admin/CloseFinancialYear';
import useAccountingStore from './store/accountingStore';
import AddNote from './components/Notes/AddNote';
import Notes from './components/Notes/Notes';
import EditNote from './components/Notes/EditNote';
import ViewNote from './components/Notes/ViewNote';
import useNotesStore from './store/notesStore';
import About from './components/Layout/About';
import FinancialRatios from './components/FinancialHealth/FinancialRatios';
import ShariahCompliance from './components/ShariahCompliance/ShariahCompliance';
import Budget from './components/Budget/Budget';
import EditBudget from './components/Budget/EditBudget';
import AddBudget from './components/Budget/AddBudget';

const App = () => {
  const { setUser } = useAuthStore();
  const { 
    setAccounts,
    setJournalEntries,
    setActiveFinancialYear,
    setFinancialYears,
    setSelectedFinancialYear } = useAccountingStore();
  const { setNotes } = useNotesStore();
  const [loading, setLoading] = useState(true);

  // fetch user
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await api.get('/users/me');
        setUser(response.data.user);

        const res = await api.get('/initial-setup');
        setAccounts(res.data.accounts);
        setActiveFinancialYear(res.data.financialYear);
        setSelectedFinancialYear(res.data.financialYear);
        setFinancialYears(res.data.financialYears);
        setJournalEntries(res.data.journalEntries);
        setNotes(res.data.notes);

      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [])

  //return
  if (loading) {
    return <Spinner />
  }

  return (
    <BrowserRouter>
      <Alert />
      <Routes>
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="financial-health" element={<FinancialHealth />} />
          <Route path="financial-ratios" element={<FinancialRatios />} />

          {/* Financial Statements */}
          <Route path="financial-statements" element={<FinancialStatements />} />

          {/* Accounts Management */}
          <Route path="accounts/add" element={<AddAccount />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="accounts/:id" element={<AccountDetails />} />

          {/* Company & Profile */}
          <Route path="company" element={<Company />} />
          <Route path="profile" element={<Profile />} />
          <Route path="about" element={<About />} />

          {/* Transactions */}
          <Route path="journal" element={<JournalEntries />} />
          <Route path="add-transaction" element={<TransactionInput />} />
          <Route path="ledgers" element={<Ledgers />} />
          <Route path="trial-balance" element={<TrialBalance />} />

          {/* Notes */}
          <Route path="notes" element={<Notes />} />
          <Route path="notes/add" element={<AddNote />} />
          <Route path="notes/edit/:id" element={<EditNote />} />
          <Route path="notes/:id" element={<ViewNote />} />

          {/* Shariah Compliace Checker */}
          <Route path="shariah-compliance" element={<ShariahCompliance />} />

          {/* Budget */}
          <Route path="budget" element={<Budget />} />

        </Route>

        {/* Profile */}
        <Route path="auth/profile" element={<Profile />} />

        {/* Guest Routes */}
        <Route path="auth/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="auth/register" element={<GuestRoute><Register /></GuestRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><Layout /></AdminRoute>}>
          <Route index element={<Admin />} />
          <Route path="users" element={<UserManagement />} />
          
          <Route path="financial-years" element={<FinancialYears />} />
          <Route path="financial-years/add" element={<AddFinancialYear />} />
          <Route path="financial-years/:id/close" element={<CloseFinancialYear />} />

          <Route path="accounts/:accountId/edit" element={<EditAccount />} />

          <Route path="budget/create" element={<AddBudget />} />
          <Route path="budget/edit" element={<EditBudget />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App