import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, Activity, DollarSign } from 'lucide-react';
import api from '../services/api';
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
  });

  const [chartData, setChartData] = useState({
    revenue: [],
    leads: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // API Calls deka eka sare karanawa (Performance wadi wenna)
        const [customersRes, invoicesRes] = await Promise.all([
          api.get('/customers'),
          api.get('/invoices')
        ]);

        const customers = customersRes.data;
        const invoices = invoicesRes.data;

        // 1. Top Cards Data Calculation
        const total = customers.length;
        const active = customers.filter(c => c.status !== 'CONVERTED').length;

        // Invoices wala totalAmount eka ekathu karanawa
        const revenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

        setStatsData({ total, active, revenue });

        // 2. Leads Chart Data Calculation (Status anuwa count eka gannawa)
        const statusCounts = { NEW: 0, CONTACTED: 0, QUALIFIED: 0, CONVERTED: 0 };
        customers.forEach(c => {
          if (statusCounts[c.status] !== undefined) statusCounts[c.status]++;
        });
        const leadsChartData = Object.keys(statusCounts).map(key => ({
          name: key,
          count: statusCounts[key]
        }));

        // 3. Revenue Chart Data Calculation (Masen maseta total eka)
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const revByMonth = {};

        invoices.forEach(inv => {
          const d = new Date(inv.createdAt); // Real system ekaka issueDate use karanna puluwan
          const m = monthNames[d.getMonth()];
          revByMonth[m] = (revByMonth[m] || 0) + inv.totalAmount;
        });

        // Last 6 months wala data array ekak hadanawa (Chart eka lassanata pennanna)
        const currentMonth = new Date().getMonth();
        const revenueChartData = [];

        for (let i = 5; i >= 0; i--) {
          let d = new Date();
          d.setMonth(currentMonth - i);
          let mName = monthNames[d.getMonth()];
          revenueChartData.push({
            month: mName,
            // Aluth account ekaka chart eka hiswa pennanawata wada podi base ekak pennanawa UI eka lassanata penna
            revenue: revByMonth[mName] || 0
          });
        }

        setChartData({ revenue: revenueChartData, leads: leadsChartData });

      } catch (error) {
        console.error(error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: 'Total Customers',
      value: isLoading ? '...' : statsData.total,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Active Leads',
      value: isLoading ? '...' : statsData.active,
      icon: Activity,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Total Revenue',
      value: isLoading ? '...' : `$${statsData.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Overview Dashboard</h2>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}! Here is what's happening at {user?.company?.name}.</p>
        </div>
        <div className="hidden md:block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm border border-blue-100">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center transition-all hover:shadow-md">
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Revenue Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue Trend (Last 6 Months)</h3>
          <div className="h-72">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-gray-400">Loading chart...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.revenue} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value) => [`$${value}`, 'Revenue']}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#1D4ED8" strokeWidth={3} dot={{ r: 4, fill: '#1D4ED8', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Leads Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Leads by Status</h3>
          <div className="h-72">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-gray-400">Loading chart...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.leads} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: '#f3f4f6' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#9333EA" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;