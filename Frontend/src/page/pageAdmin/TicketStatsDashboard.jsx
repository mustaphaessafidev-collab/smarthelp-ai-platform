import React, { useEffect, useMemo, useState } from "react";
import {
  Ticket,
  CircleCheckBig,
  CircleAlert,
  CalendarDays,
  BarChart3,
  AlertCircle,
} from "lucide-react";
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
        setChartData(response.data.chartData || []);
      } catch (err) {
        console.error("Erreur lors du chargement des statistiques :", err);
        setError(
          err.response?.data?.message ||
            "Impossible de récupérer les statistiques"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const todayData = useMemo(() => {
    if (!chartData.length) return null;
    return chartData[chartData.length - 1];
  }, [chartData]);

  const StatCard = ({ title, value, icon: Icon, iconBg, iconColor, subtitle }) => (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-3 text-3xl font-bold text-slate-900">{value}</h3>
          {subtitle && <p className="mt-2 text-xs text-slate-500">{subtitle}</p>}
        </div>

        <div className={`rounded-2xl p-3 ${iconBg}`}>
          <Icon className={iconColor} size={22} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-100">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-600 border-t-transparent"></div>
          </div>
          <h2 className="text-lg font-semibold text-slate-900">
            Chargement du tableau de bord
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Veuillez patienter...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-3xl border border-red-200 bg-white px-8 py-10 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={42} />
          <h2 className="text-lg font-semibold text-slate-900">
            Une erreur est survenue
          </h2>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  const todayCreated = todayData?.created ?? 0;
  const todayResolved = todayData?.resolved ?? 0;
  const todayMax = Math.max(todayCreated, todayResolved, 1);
  const createdPercent = (todayCreated / todayMax) * 100;
  const resolvedPercent = (todayResolved / todayMax) * 100;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Tableau de bord des tickets
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Suivi global des performances du support
            </p>
          </div>

          
        </div>

        {stats && (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
              <StatCard
                title="Total des tickets"
                value={stats.totalTickets}
                icon={Ticket}
                iconBg="bg-blue-100"
                iconColor="text-blue-600"
              />

              <StatCard
                title="Tickets résolus"
                value={stats.resolvedTickets}
                icon={CircleCheckBig}
                iconBg="bg-green-100"
                iconColor="text-green-600"
                subtitle={`Taux de résolution : ${stats.resolutionRate}%`}
              />

              <StatCard
                title="Tickets ouverts"
                value={stats.openTickets}
                icon={CircleAlert}
                iconBg="bg-orange-100"
                iconColor="text-orange-600"
              />

              <StatCard
                title="Résolus aujourd’hui"
                value={stats.resolvedToday}
                icon={CalendarDays}
                iconBg="bg-violet-100"
                iconColor="text-violet-600"
              />

              <StatCard
                title="Résolus ce mois-ci"
                value={stats.resolvedThisMonth}
                icon={BarChart3}
                iconBg="bg-indigo-100"
                iconColor="text-indigo-600"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    Activité d’aujourd’hui
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Vue rapide des tickets créés et résolus aujourd’hui
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-blue-50 p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">
                        Tickets créés
                      </span>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        Aujourd’hui
                      </span>
                    </div>

                    <p className="text-3xl font-bold text-blue-600">
                      {todayCreated}
                    </p>

                    <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-blue-100">
                      <div
                        className="h-3 rounded-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${createdPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl bg-green-50 p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">
                        Tickets résolus
                      </span>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Aujourd’hui
                      </span>
                    </div>

                    <p className="text-3xl font-bold text-green-600">
                      {todayResolved}
                    </p>

                    <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-green-100">
                      <div
                        className="h-3 rounded-full bg-green-500 transition-all duration-300"
                        style={{ width: `${resolvedPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">
                    {todayResolved >= todayCreated
                      ? "Le rythme de résolution est bon aujourd’hui."
                      : "Le nombre de tickets créés dépasse les tickets résolus aujourd’hui."}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">
                  Résumé rapide
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Les indicateurs essentiels
                </p>

                <div className="mt-4 space-y-3">
                  <div className="rounded-xl bg-violet-50 px-4 py-3">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold text-violet-700">
                        {stats.totalTickets}
                      </span>{" "}
                      ticket(s) au total.
                    </p>
                  </div>

                  <div className="rounded-xl bg-orange-50 px-4 py-3">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold text-orange-700">
                        {stats.openTickets}
                      </span>{" "}
                      ticket(s) encore ouverts.
                    </p>
                  </div>

                  <div className="rounded-xl bg-green-50 px-4 py-3">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold text-green-700">
                        {stats.resolutionRate}%
                      </span>{" "}
                      de taux de résolution.
                    </p>
                  </div>

                  <div className="rounded-xl bg-indigo-50 px-4 py-3">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold text-indigo-700">
                        {stats.resolvedThisMonth}
                      </span>{" "}
                      résolu(s) ce mois-ci.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TicketStatsDashboard;