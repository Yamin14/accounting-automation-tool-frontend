import { Menu, ChevronDown, User } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import { Link } from 'react-router';

interface NavbarProps {
    setSidebarOpen: (open: boolean) => void;
}

const Navbar = ({ setSidebarOpen }: NavbarProps) => {
    const { user } = useAuthStore();
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-white/20 px-4 py-3">
            <div className="flex items-center justify-between">
                {/* Mobile menu button */}
                <button
                    type="button"
                    className="md:hidden h-10 w-10 inline-flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-900 hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    onClick={() => setSidebarOpen(true)}
                >
                    <Menu className="h-5 w-5" />
                </button>

                {/* Desktop spacer */}
                <div className="hidden md:block"></div>

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>

                    {/* User Dropdown Menu */}
                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 z-50">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <div>
                                        <p className="font-semibold text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                        <p className="text-xs text-blue-600 font-medium">{user.company.companyName}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="py-2">
                                <Link
                                    to='/auth/profile'
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    <User className="h-4 w-4 mr-3 text-gray-400" />
                                    Profile Settings
                                </Link>
                                {user.role === 'admin' &&
                                    <Link
                                        to='/admin'
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                        <User className="h-4 w-4 mr-3 text-gray-400" />
                                        Admin Page
                                    </Link>}
                                <Link
                                    to='/company'
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    <User className="h-4 w-4 mr-3 text-gray-400" />
                                    Company
                                </Link>
                                <Link
                                    to='/about'
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    <User className="h-4 w-4 mr-3 text-gray-400" />
                                    About
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar