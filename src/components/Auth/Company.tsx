import { Building2 } from "lucide-react";
import useAuthStore from "../../store/authStore";

const Company = () => {
  const { user } = useAuthStore();
  const company = user?.company;

  if (!company)
    return <div className="text-center mt-20 text-gray-600 text-lg">No company found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5 pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
            <Building2 className="text-white w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Company Information</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/70 p-6 rounded-2xl border border-gray-100 shadow-md">
            <p><strong>Company Name:</strong> {company.companyName}</p>
            <p><strong>Business Type:</strong> {company.businessType}</p>
            <p><strong>Finance Type:</strong> {company.financeType}</p>
          </div>

          <div className="bg-white/70 p-6 rounded-2xl border border-gray-100 shadow-md">
            <p><strong>Industry:</strong> {company.industry}</p>
            <p><strong>Email:</strong> {company.email}</p>
            <p><strong>Address:</strong> {company.address}</p>
            <p><strong>Code:</strong> {company.code}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Company;
