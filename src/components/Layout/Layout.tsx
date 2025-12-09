import { Outlet } from "react-router"
import Navbar from "./Navbar"
import { useState } from "react";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="md:pl-72 flex flex-col flex-1">
        <Navbar
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
)}

export default Layout