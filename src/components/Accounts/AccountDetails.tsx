import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Wallet, ArrowLeft } from "lucide-react";
import api from "../../api/api";
import Spinner from "../Layout/Spinner";
import NotFound from "../Layout/NotFound";
import useAlertStore from "../../store/alertStore";
import useAuthStore from "../../store/authStore";

const AccountDetails = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { addAlert } = useAlertStore();
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // fetch account
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await api.get(`companies/${user.company._id}/accounts/${id}`);
        setAccount(res.data.account);
      } catch {
        addAlert("Failed to fetch account details", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchAccount();
  }, [id, user.company._id]);

  // return
  if (loading) return <Spinner />;
  if (!account) return <NotFound />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5 pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <Wallet className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{account.accountName}</h1>
              <p className="text-gray-600">{account.category} • {account.subCategory}</p>
            </div>
          </div>
          <Link
            to="/accounts"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-xl hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white/70 p-6 rounded-2xl border border-gray-100 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Info</h3>
            <p><strong>Type:</strong> {account.accountType}</p>
            <p><strong>Financial Statement:</strong> {account.financialStatement}</p>
            <p><strong>Category:</strong> {account.category}</p>
            <p><strong>Subcategory:</strong> {account.subCategory}</p>
          </div>

          <div className="bg-white/70 p-6 rounded-2xl border border-gray-100 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Balance</h3>
            <p className="text-3xl font-bold text-blue-800">
              ${account.balance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
