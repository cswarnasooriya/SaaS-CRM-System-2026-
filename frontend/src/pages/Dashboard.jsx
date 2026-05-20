import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, Activity, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const stats = [
    { title: 'Total Customers', value: '0', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Active Leads', value: '0', icon: Activity, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Revenue', value: '$0', icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name}! 👋</h2>
        <p className="text-gray-600 mt-1">Here is what's happening at {user?.company?.name} today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
              <div className={`p-4 rounded-full ${stat.bg} mr-4`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;