import React, { useEffect, useState } from "react";
import { TrendingUp, CheckCircle2, AlertCircle, Clock, Zap } from "lucide-react";
import axios from "axios";

function AgentDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:4002/api/tickets/agent/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Agent stats:", response.data);
        setStats(response.data.stats);
        setError(null);
      } catch (err) {
        console.error("Error fetching agent stats:", err);
        setError(
          err.response?.data?.message || "Failed to fetch your statistics"
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-600 font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
          {subtext && (
            <p className="text-xs text-slate-500 mt-2">{subtext}</p>
          )}
        </div>
        <div className={`rounded-lg p-3 ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f6f7fb]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-violet-100 mb-4">
            <div className="animate-spin h-8 w-8 border-2 border-violet-600 border-t-transparent rounded-full"></div>
          </div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f6f7fb]">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-orange-500" />
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f7fb] min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome, Agent! 👋
          </h1>
          <p className="text-slate-600 mt-2">
            Here's your performance overview
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard
              title="My Tickets"
              value={stats.myTickets}
              icon={TrendingUp}
              color="bg-blue-500"
              subtext="Total assigned tickets"
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
              subtext="Need your attention"
            />
            <StatCard
              title="Today"
              value={stats.resolvedToday}
              icon={Zap}
              color="bg-violet-500"
              subtext="Resolved today"
            />
            <StatCard
              title="This Month"
              value={stats.resolvedThisMonth}
              icon={Clock}
              color="bg-indigo-500"
              subtext="Resolved this month"
            />
          </div>
        )}

        {/* Insights */}
        {stats && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              📊 Your Performance
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <span className="text-slate-700 font-medium">
                  Resolution Rate
                </span>
                <span className="text-2xl font-bold text-green-600">
                  {stats.resolutionRate}%
                </span>
              </div>

              {stats.openTickets > 0 && (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                  <span className="text-slate-700 font-medium">
                    Tickets Awaiting Your Response
                  </span>
                  <span className="text-2xl font-bold text-orange-600">
                    {stats.openTickets}
                  </span>
                </div>
              )}

              {stats.resolvedToday === 0 && stats.openTickets > 0 && (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <span className="text-slate-700 font-medium">
                    Action Required
                  </span>
                  <span className="text-sm text-blue-600">
                    Start resolving tickets to boost your stats today
                  </span>
                </div>
              )}

              {stats.resolvedToday > 0 && (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-200">
                  <span className="text-slate-700 font-medium">
                    Great Job! 🎉
                  </span>
                  <span className="text-sm text-violet-600">
                    You resolved {stats.resolvedToday} ticket
                    {stats.resolvedToday !== 1 ? "s" : ""} today
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/Agent/Tickets"
            className="block p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-md transition-shadow text-center"
          >
            <h3 className="text-lg font-bold text-slate-900">View My Tickets</h3>
            <p className="text-sm text-slate-500 mt-2">
              See all your assigned tickets
            </p>
          </a>
          <a
            href="/Agent/AllTickets"
            className="block p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-md transition-shadow text-center"
          >
            <h3 className="text-lg font-bold text-slate-900">
              Browse All Tickets
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              Find tickets to work on
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}

export default AgentDashboard;