import { useState, useEffect } from "react";
import { Calendar, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Spinner from "../Layout/Spinner";
import useAlertStore from "../../store/alertStore";
import api from "../../api/api";

const FinancialYears = () => {
    const [financialYears, setFinancialYears] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { addAlert } = useAlertStore();
    
    //   Fetch financial years on component mount
    useEffect(() => {
        const fetchFinancialYears = async () => {
            setLoading(true);
            try {
                const res = await api.get('/financial-years');
                setFinancialYears(res.data.financialYears);
                addAlert("Financial years fetched successfully", "success");

            } catch (error) {
                addAlert("Failed to fetch financial years", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchFinancialYears();
    }, []);

    // return
    if (loading) return <Spinner />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 relative">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5 pointer-events-none"></div>

            <div className="relative max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-2xl">
                            <Calendar className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-1">
                                Financial Years
                            </h1>
                            <p className="text-gray-600">Manage your company's financial periods</p>
                        </div>
                    </div>

                    {/* Top Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/admin"
                            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white text-sm font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Link>

                        <Link
                            to="/admin/financial-years/add"
                            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                        >
                            Add Financial Year
                        </Link>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Start Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">End Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {financialYears.map((fy) => (
                                    <tr key={fy._id} className="hover:bg-blue-50/50 transition-all duration-200">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{fy.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(fy.startDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(fy.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {fy.isActive ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {fy.isActive && (
                                                <Link
                                                    to={`/admin/financial-years/${fy._id}/close`}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white text-xs font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                                >
                                                    Close
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialYears;
