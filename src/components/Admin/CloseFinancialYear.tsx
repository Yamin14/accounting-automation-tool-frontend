import { Link, useNavigate, useParams } from "react-router";
import { XCircle } from "lucide-react";
import api from "../../api/api";
import useAlertStore from "../../store/alertStore";
import useAccountingStore from "../../store/accountingStore";

const CloseFinancialYear = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addAlert } = useAlertStore();
    const { setActiveFinancialYear } = useAccountingStore();

    //   close financial year
    const handleClose = async () => {
        try {
            await api.put(`/financial-years/${id}/close`);
            addAlert("Financial year closed successfully", "success");
            setActiveFinancialYear(null);
            navigate("/admin/financial-years");

        } catch {
            addAlert("Failed to close financial year", "error");
        }
    };

    // return
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
            <div className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 text-center max-w-md">
                <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl shadow-xl mb-6">
                    <XCircle className="text-white w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Close Financial Year
                </h2>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to close this financial year? This action cannot
                    be undone.
                </p>
                <div className="flex justify-center gap-4">
                    <Link
                        to="/admin/financial-years"
                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-all duration-200"
                    >
                        Cancel
                    </Link>
                    <button
                        onClick={handleClose}
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                        Confirm Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CloseFinancialYear;
