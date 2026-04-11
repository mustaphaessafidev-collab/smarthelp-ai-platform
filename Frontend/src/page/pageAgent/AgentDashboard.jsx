import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Ticket,
  CircleCheckBig,
  CircleAlert,
  CalendarDays,
  BarChart3,
  AlertCircle,
} from "lucide-react";

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

        setStats(response.data.stats);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des statistiques agent :", err);
        setError(
          err.response?.data?.message ||
            "Impossible de récupérer vos statistiques"
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    } else {
      setLoading(false);
      setError("Utilisateur non authentifié");
    }
  }, [token]);

  const StatCard = ({ title, value, subtitle, icon: Icon, iconBg, iconColor }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between hover:shadow-md transition">
    
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
    </div>

    <div className={`p-3 rounded-2xl ${iconBg}`}>
      <Icon className={`${iconColor}`} size={22} />
    </div>
  </div>
);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-violet-600 border-t-transparent"></div>
          <p className="text-sm text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-3xl border border-red-200 bg-white px-8 py-10 text-center shadow-sm">
          <p className="text-base font-semibold text-slate-900">
            Une erreur est survenue
          </p>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Tableau de bord agent
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Aperçu simple de votre activité
          </p>
        </div>

        {stats && (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
  <StatCard
    title="Mes tickets"
    value={stats.myTickets ?? 0}
    subtitle="Tickets qui vous sont attribués"
    icon={Ticket}
    iconBg="bg-blue-100"
    iconColor="text-blue-600"
  />

  <StatCard
    title="Tickets ouverts"
    value={stats.openTickets ?? 0}
    subtitle="Demandes en cours de traitement"
    icon={CircleAlert}
    iconBg="bg-orange-100"
    iconColor="text-orange-600"
  />

  <StatCard
    title="Résolus aujourd’hui"
    value={stats.resolvedToday ?? 0}
    subtitle="Tickets résolus aujourd’hui"
    icon={CalendarDays}
    iconBg="bg-violet-100"
    iconColor="text-violet-600"
  />

  <StatCard
    title="Taux de résolution"
    value={`${stats.resolutionRate ?? 0}%`}
    subtitle="Performance globale"
    icon={BarChart3}
    iconBg="bg-green-100"
    iconColor="text-green-600"
  />
</div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">
                  Résumé rapide
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Les informations essentielles de votre activité
                </p>

                <div className="mt-4 space-y-3">
                  <div className="rounded-xl bg-blue-50 px-4 py-3">
                    <p className="text-sm text-slate-700">
                      Vous avez{" "}
                      <span className="font-semibold text-blue-700">
                        {stats.myTickets ?? 0}
                      </span>{" "}
                      ticket(s) assigné(s).
                    </p>
                  </div>

                  <div className="rounded-xl bg-orange-50 px-4 py-3">
                    <p className="text-sm text-slate-700">
                      Il reste{" "}
                      <span className="font-semibold text-orange-700">
                        {stats.openTickets ?? 0}
                      </span>{" "}
                      ticket(s) ouvert(s).
                    </p>
                  </div>

                  <div className="rounded-xl bg-green-50 px-4 py-3">
                    <p className="text-sm text-slate-700">
                      Votre taux de résolution est de{" "}
                      <span className="font-semibold text-green-700">
                        {stats.resolutionRate ?? 0}%
                      </span>
                      .
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">
                  Activité du jour
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Vue simple de votre progression aujourd’hui
                </p>

                <div className="mt-6 space-y-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">
                        Tickets résolus aujourd’hui
                      </span>
                      <span className="text-sm font-semibold text-violet-600">
                        {stats.resolvedToday ?? 0}
                      </span>
                    </div>

                    <div className="h-3 w-full overflow-hidden rounded-full bg-violet-100">
                      <div
                        className="h-3 rounded-full bg-violet-500 transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            ((stats.resolvedToday ?? 0) / Math.max(stats.myTickets ?? 1, 1)) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">
                        Tickets ouverts
                      </span>
                      <span className="text-sm font-semibold text-orange-600">
                        {stats.openTickets ?? 0}
                      </span>
                    </div>

                    <div className="h-3 w-full overflow-hidden rounded-full bg-orange-100">
                      <div
                        className="h-3 rounded-full bg-orange-500 transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            ((stats.openTickets ?? 0) / Math.max(stats.myTickets ?? 1, 1)) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-600">
                      {stats.resolvedToday > 0
                        ? `Bon travail, vous avez déjà résolu ${stats.resolvedToday} ticket(s) aujourd’hui.`
                        : "Aucun ticket résolu pour le moment aujourd’hui."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <a
                href="/Agent/Tickets"
                className="block rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:shadow-md"
              >
                <h3 className="text-lg font-bold text-slate-900">
                  Voir mes tickets
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Consulter les tickets qui vous sont attribués
                </p>
              </a>

              <a
                href="/Agent/AllTickets"
                className="block rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:shadow-md"
              >
                <h3 className="text-lg font-bold text-slate-900">
                  Parcourir tous les tickets
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Explorer les autres tickets disponibles
                </p>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AgentDashboard;