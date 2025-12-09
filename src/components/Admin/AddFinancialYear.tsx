import { useState } from "react";
import { CalendarPlus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import api from "../../api/api";
import useAuthStore from "../../store/authStore";
import useAlertStore from "../../store/alertStore";
import useAccountingStore from "../../store/accountingStore";

const AddFinancialYear = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addAlert } = useAlertStore();
  const { setActiveFinancialYear, setFinancialYears } = useAccountingStore();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      addAlert("Please select both start and end dates", "error");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays !== 364) {
      addAlert("The financial year must be exactly 365 days long", "error");
      return;
    }

    try {
      const res = await api.post("/financial-years", {
        companyId: user.company._id,
        startDate,
        endDate,
      });
      addAlert("Financial year added successfully", "success");
      setActiveFinancialYear(res.data.activeFinancialYear);
      setFinancialYears(res.data.financialYears);

      navigate("/admin/financial-years");
    } catch {
      addAlert("Failed to add financial year", "error");
    }
  };

  const autoSetEndDate = (start: string) => {
    const startObj = new Date(start);
    if (isNaN(startObj.getTime())) return;
    const endObj = new Date(startObj);
    endObj.setDate(endObj.getDate() + 364);
    setEndDate(endObj.toISOString().split("T")[0]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 flex flex-col items-center">
      {/* Header Section */}
      <div className="flex items-center justify-between w-full max-w-2xl mb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 hover:bg-white/90 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
          <span className="text-gray-800 font-medium">Back</span>
        </button>

        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <CalendarPlus className="w-8 h-8 text-blue-600" />
          Add Financial Year
        </h2>

        {/* Placeholder to balance flex spacing */}
        <div className="w-[100px]"></div>
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md"
      >
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Start Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            autoSetEndDate(e.target.value);
          }}
          required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50"
        />

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          End Date
        </label>
        <input
          type="date"
          value={endDate}
          readOnly
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-6 bg-gray-100 cursor-not-allowed"
        />

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Add Year
        </button>
      </form>
    </div>
  );
};

export default AddFinancialYear;
