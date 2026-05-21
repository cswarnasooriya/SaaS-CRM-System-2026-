import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, Activity, DollarSign, CheckSquare, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  
  const [statsData, setStatsData] = useState({
    total: 0,
    active: 0,
    revenue: 0,
    conversionRate: 0,
  });

  const [recentTasks, setRecentTasks] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);

  const [chartData, setChartData] = useState({
    revenue: [],
    leads: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [customersRes, invoicesRes, tasksRes] = await Promise.all([
          api.get('/customers').catch(() => ({ data: [] })),
          api.get('/invoices').catch(() => ({ data: [] })),
          api.get('/tasks').catch(() => ({ data: [] }))
        ]);
        
        const customers = customersRes.data || [];
        const invoices = invoicesRes.data || [];
        const tasks = tasksRes.data || [];
        
        const total = customers.length;
        const active = customers.filter(c => c.status !== 'CONVERTED').length;
        const revenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0); 
        
        const convertedCount = customers.filter(c => c.status === 'CONVERTED').length;
        const conversionRate = total > 0 ? Math.round((convertedCount / total) * 100) : 0;

        setStatsData({ total, active, revenue, conversionRate });

        // FIXED: PENDING wenuwata COMPLETED nathi anith okkoma open active agile tasks gannawa
        const activeTasks = tasks.filter(t => t.status !== 'COMPLETED');
        setRecentTasks(activeTasks.slice(0, 3));
        setRecentCustomers(customers.slice(0, 3));

        const statusCounts = { NEW: 0, CONTACTED: 0, QUALIFIED: 0, CONVERTED: 0 };
        customers.forEach(c => {
          if (statusCounts[c.status] !== undefined) statusCounts[c.status]++;
        });
        const leadsChartData = Object.keys(statusCounts).map(key => ({
          name: key,
          count: statusCounts[key]
        }));

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const revByMonth = {};
        
        invoices.forEach(inv => {
          const d = new Date(inv.createdAt);
          const m = monthNames[d.getMonth()];
          revByMonth[m] = (revByMonth[m] || 0) + inv.totalAmount;
        });

        const currentMonth = new Date().getMonth();
        const revenueChartData = [];
        
        for (let i = 5; i >= 0; i--) {
          let d = new Date();
          d.setMonth(currentMonth - i);
          let mName = monthNames[d.getMonth()];
          revenueChartData.push({
            month: mName,
            revenue: revByMonth[mName] || 0 
          });
        }

        setChartData({ revenue: revenueChartData, leads: leadsChartData });

      } catch (error) {
        console.error(error);
        toast.error('Failed to load dashboard intelligence analytics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { title: 'Total Customers', value: isLoading ? '...' : statsData.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Active Leads', value: isLoading ? '...' : statsData.active, icon: Activity, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Total Revenue', value: isLoading ? '...' : `$${statsData.revenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Workspace Overview</h2>
          <p className="text-gray-600 mt-1">Hello {user?.name}, here is what's happening today.</p>
        </div>
        <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold text-sm border border-blue-100 flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center transition-all hover:shadow-md">
              <div className={`p-4 rounded-full ${stat.bg} mr-4`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">{stat.value}</p>
              </div>
            </div>
          );
        })}

        {/* Progress Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-500">Lead Conversion Rate</p>
            <TrendingUp className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{isLoading ? '...' : `${statsData.conversionRate}%`}</p>
          <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${statsData.conversionRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-md font-bold text-gray-800 mb-6">Revenue Performance ($)</h3>
          <div className="h-64">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-gray-400">Loading metrics...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.revenue}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#1D4ED8" strokeWidth={3} dot={{ r: 4, fill: '#1D4ED8', strokeWidth: 2, stroke: '#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Pipeline Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-md font-bold text-gray-800 mb-6">Pipeline Status Funnel</h3>
          <div className="h-64">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-gray-400">Loading metrics...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.leads}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} allowDecimals={false} />
                  <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Bar dataKey="count" fill="#9333EA" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Operations Feed Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-bold text-gray-800 flex items-center">
                <CheckSquare className="w-5 h-5 mr-2 text-yellow-500" />
                Action Required (Active Tasks)
              </h3>
              <Link to="/tasks" className="text-xs text-blue-600 hover:underline flex items-center font-semibold">
                Go to Tasks <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
            
            <div className="space-y-3">
              {isLoading ? (
                <p className="text-sm text-gray-400 py-2">Loading tasks...</p>
              ) : recentTasks.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">No urgent follow-ups pending!</p>
              ) : (
                recentTasks.map(task => (
                  <div key={task.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-bold text-gray-800">{task.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Stage: <span className="text-blue-600 font-semibold">{task.status}</span> | Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">Active</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Onboarded Leads */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-bold text-gray-800 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-500" />
                Recently Onboarded Leads
              </h3>
              <Link to="/customers" className="text-xs text-blue-600 hover:underline flex items-center font-semibold">
                View Directory <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <p className="text-sm text-gray-400 py-2">Loading accounts...</p>
              ) : recentCustomers.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">No leads onboarded yet.</p>
              ) : (
                recentCustomers.map(customer => (
                  <div key={customer.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-bold text-gray-800">{customer.firstName} {customer.lastName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{customer.email}</p>
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{customer.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;