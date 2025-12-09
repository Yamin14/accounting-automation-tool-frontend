import { GraduationCap, Users, User, BookOpenText } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5 pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl">
            <BookOpenText className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              About the Project
            </h1>
            <p className="text-gray-600 mt-1">
              Final Year Project Information
            </p>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-100/60 to-indigo-100/60 shadow-inner border border-blue-200/40">
              <div className="flex items-center gap-3 mb-3">
                <User className="text-blue-600 w-6 h-6" />
                <h2 className="text-lg font-semibold text-gray-900">Head of Department</h2>
              </div>
              <p className="text-gray-700 font-medium">Dr. Muhammad Awais</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-100/60 to-purple-100/60 shadow-inner border border-indigo-200/40">
              <div className="flex items-center gap-3 mb-3">
                <GraduationCap className="text-indigo-600 w-6 h-6" />
                <h2 className="text-lg font-semibold text-gray-900">Degree Program</h2>
              </div>
              <p className="text-gray-700 font-medium">BS Accounting & Finance</p>
              <p className="text-gray-600 text-sm mt-1">8th Semester</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-100/60 to-blue-100/60 shadow-inner border border-purple-200/40">
              <div className="flex items-center gap-3 mb-3">
                <User className="text-purple-600 w-6 h-6" />
                <h2 className="text-lg font-semibold text-gray-900">Project Supervisor</h2>
              </div>
              <p className="text-gray-700 font-medium">Ms. Rimsha Ejaz</p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-100/60 to-indigo-100/60 shadow-inner border border-blue-200/40">
              <div className="flex items-center gap-3 mb-3">
                <Users className="text-indigo-600 w-6 h-6" />
                <h2 className="text-lg font-semibold text-gray-900">Group Members</h2>
              </div>
              <ul className="text-gray-700 font-medium space-y-2">
                <li>Emman Ahmed — S-22-BSAF-007</li>
                <li>Mahnoor Sohail — S-22-BSAF-014</li>
                <li>Muhammad Usman — S-22-BSAF-017</li>
                <li>Syed Yamin Ali Kazmi — S-22-BSAF-027</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-10 text-center text-gray-600 text-sm">
          <p>
            Department of Accounting & Finance — Foundation University School of Science and Technology
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
