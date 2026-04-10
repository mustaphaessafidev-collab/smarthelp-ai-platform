import React, { useEffect, useState } from "react";
import { TrendingUp, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import axios from "axios";

function TicketStatsDashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:4002/api/tickets/admin/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStats(response.data.stats);
        setChartData(response.data.chartData);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err.response?.data?.message || "Failed to fetch statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-600 mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
          {subtext && <p className="text-xs text-slate-500 mt-2">{subtext}</p>}
        </div>
        <div className={`rounded-full p-3 ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#f6f7fb] min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Ticket Dashboard</h1>
          <p className="text-slate-600 mt-2">
            Real-time analytics and statistics
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <StatCard
                title="Total Tickets"
                value={stats.totalTickets}
                icon={TrendingUp}
                color="bg-blue-500"
              />
              <StatCard
                title="Resolved"
                value={stats.resolvedTickets}
                icon={CheckCircle2}
                color="bg-green-500"
                subtext={`${stats.resolutionRate}% resolution rate`}
              />
              <StatCard
                title="Open Tickets"
                value={stats.openTickets}
                icon={AlertCircle}
                color="bg-orange-500"
              />
              <StatCard
                title="Resolved Today"
                value={stats.resolvedToday}
                icon={CheckCircle2}
                color="bg-violet-500"
              />
              <StatCard
                title="Resolved This Month"
                value={stats.resolvedThisMonth}
                icon={Clock}
                color="bg-indigo-500"
              />
            </div>

            {/* Chart Section */}
            {chartData && chartData.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  Tickets Last 7 Days
                </h2>

                <div className="space-y-4">
                  {chartData.map((day) => {
                    const maxValue = Math.max(
                      ...chartData.map((d) => Math.max(d.created, d.resolved))
                    );
                    const createdPercent = (day.created / maxValue) * 100;
                    const resolvedPercent = (day.resolved / maxValue) * 100;

                    return (
                      <div key={day.date}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">
                            {new Date(day.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <div className="flex gap-4 text-xs">
                            <span className="text-blue-600">
                              Created: {day.created}
                            </span>
                            <span className="text-green-600">
                              Resolved: {day.resolved}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 h-6">
                          <div
                            className="bg-blue-500 rounded-lg transition-all"
                            style={{ width: `${createdPercent}%` }}
                            title={`${day.created} created`}
                          />
                          <div
                            className="bg-green-500 rounded-lg transition-all"
                            style={{ width: `${resolvedPercent}%` }}
                            title={`${day.resolved} resolved`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 flex gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-slate-600">Created</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-slate-600">Resolved</span>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Box */}
            <div className="mt-8 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-200">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Summary & Insights
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>
                  ✓ You have resolved{" "}
                  <span className="font-bold text-green-600">
                    {stats.resolutionRate}%
                  </span>{" "}
                  of all tickets
                </li>
                <li>
                  ✓ There are{" "}
                  <span className="font-bold text-orange-600">
                    {stats.openTickets}
                  </span>{" "}
                  open tickets waiting for attention
                </li>
                <li>
                  ✓ You resolved{" "}
                  <span className="font-bold text-violet-600">
                    {stats.resolvedToday}
                  </span>{" "}
                  tickets today
                </li>
                {stats.resolvedThisMonth > 0 && (
                  <li>
                    ✓ Great performance this month with{" "}
                    <span className="font-bold text-indigo-600">
                      {stats.resolvedThisMonth}
                    </span>{" "}
                    resolved tickets
                  </li>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TicketStatsDashboard;
