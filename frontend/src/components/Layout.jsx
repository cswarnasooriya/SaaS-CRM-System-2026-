import { useContext } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, FileText, LogOut, Building2, Kanban, Settings as SettingsIcon, LayoutGrid } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Pipeline', path: '/pipeline', icon: Kanban },
    { name: 'Task Board', path: '/tasks', icon: LayoutGrid },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Invoices', path: '/invoices', icon: FileText },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Building2 className="w-6 h-6 text-blue-600 mr-2" />
          <span className="font-bold text-gray-800 truncate">
            {user?.company?.name || 'CRM Workspace'}
          </span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 font-bold' 
                    : 'text-gray-600 hover:bg-gray-100 font-medium'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer font-medium"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="text-xl font-bold text-gray-800 capitalize">
            {location.pathname.split('/') || 'Dashboard'}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{user?.name}</p>
              <p className="text-xs font-semibold text-gray-400 uppercase">{user?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;