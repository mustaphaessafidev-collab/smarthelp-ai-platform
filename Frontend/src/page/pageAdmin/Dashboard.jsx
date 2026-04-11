import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiFileText,
  FiUsers,
  FiUserCheck,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiTrendingUp,
  FiCalendar,
  FiRefreshCw,
} from "react-icons/fi";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import StatCard from "../../components/Admin/StatCard";
import TicketTable from "../../components/Admin/TicketTable";
import AlertsSection from "../../components/Admin/AlertsSection";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const token = localStorage.getItem("token");

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get(
        "http://localhost:4002/api/tickets/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Dashboard data:", response.data);
      setData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setError(
        err.response?.data?.message || "Failed to load dashboard data"
      );
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (token) {
      fetchDashboardData().finally(() => setLoading(false));
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f6f7fb]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-violet-100 mb-4">
            <div className="animate-spin h-8 w-8 border-2 border-violet-600 border-t-transparent rounded-full"></div>
          </div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f6f7fb]">
        <div className="text-center max-w-md">
          <FiAlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { stats, charts, tickets } = data || {};
  const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

  return (
    <div className="bg-[#f6f7fb] min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 mt-2">
              Welcome back! Here's your platform overview.
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="rounded-lg p-2 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw
              size={24}
              className={`text-slate-600 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {/* Top Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={FiUsers}
              color="bg-blue-500"
              description="Active users"
            />
            <StatCard
              title="Total Agents"
              value={stats.totalAgents}
              icon={FiUserCheck}
              color="bg-purple-500"
              description="Support agents"
            />
            <StatCard
              title="Total Tickets"
              value={stats.totalTickets}
              icon={FiFileText}
              color="bg-orange-500"
              description="All tickets"
            />
            <StatCard
              title="Open Tickets"
              value={stats.openTickets}
              icon={FiAlertCircle}
              color="bg-red-500"
              description="Needs attention"
            />
            <StatCard
              title="Resolved"
              value={stats.resolvedTickets}
              icon={FiCheckCircle}
              color="bg-green-500"
              trend={stats.resolutionRate}
              description={`${stats.resolutionRate}% rate`}
            />
          </div>
        )}

        {/* Secondary Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard
              title="Pending"
              value={stats.pendingTickets}
              icon={FiClock}
              color="bg-yellow-500"
              description="Awaiting action"
            />
            <StatCard
              title="Closed Today"
              value={stats.todayClosed}
              icon={FiTrendingUp}
              color="bg-indigo-500"
              description="Today's progress"
            />
            <StatCard
              title="This Month"
              value={stats.monthlyTickets}
              icon={FiCalendar}
              color="bg-cyan-500"
              description="Monthly tickets"
            />
          </div>
        )}

        {/* Alerts Section - High Priority & Pending */}
        {tickets && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">🚨 Alerts & Important Tickets</h2>
            <AlertsSection
              highPriorityTickets={tickets.highPriority || []}
              pendingTickets={tickets.pending || []}
            />
          </div>
        )}

        {/* Charts Section */}
        {charts && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">📊 Analytics & Trends</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Line Chart - Tickets Per Day */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">
                  📈 Tickets This Week
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={charts.ticketsPerDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="tickets"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ fill: "#8b5cf6", r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart - Status Distribution */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">
                  📊 Status Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={charts.statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) =>
                        `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {charts.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart - Priority Distribution */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm lg:col-span-2">
                <h3 className="text-lg font-bold text-slate-900 mb-6">
                  ⚡ Priority Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={charts.priorityDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Recent Tickets Table */}
        {tickets && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">📋 Recent Tickets</h2>
            <TicketTable tickets={tickets.recent || []} />
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start mb-8">
          <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition-all hover:scale-105">
            📊 View All Tickets
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-medium hover:shadow-lg transition-all hover:scale-105">
            👥 Manage Users
          </button>
          <button className="px-6 py-3 bg-white border-2 border-violet-600 text-violet-600 rounded-full font-medium hover:bg-violet-50 transition-colors">
            📈 Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
