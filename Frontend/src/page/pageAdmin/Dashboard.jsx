import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchDashboardData = async () => {
    try {
      setError(null);

      const response = await axios.get(
        "http://localhost:4002/api/tickets/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement du tableau de bord :", err);
      setError(
        err.response?.data?.message ||
          "Impossible de charger les données du tableau de bord"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    } else {
      setLoading(false);
      setError("Utilisateur non authentifié");
    }
  }, [token]);

  const formatStatus = (status) => {
    switch (status) {
      case "NEW":
        return "Nouveau";
      case "OPEN":
        return "Ouvert";
      case "IN_PROGRESS":
        return "En cours";
      case "PENDING":
        return "En attente";
      case "RESOLVED":
        return "Résolu";
      case "CLOSED":
        return "Fermé";
      default:
        return status;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "NEW":
        return "bg-violet-100 text-violet-700";
      case "OPEN":
        return "bg-blue-100 text-blue-700";
      case "IN_PROGRESS":
        return "bg-amber-100 text-amber-700";
      case "PENDING":
        return "bg-orange-100 text-orange-700";
      case "RESOLVED":
        return "bg-green-100 text-green-700";
      case "CLOSED":
        return "bg-slate-200 text-slate-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const StatCard = ({ title, value, color }) => (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className={`mt-3 text-3xl font-bold ${color}`}>{value}</h3>
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

  const stats = data?.stats || {};
  const charts = data?.charts || {};
  const tickets = data?.tickets || {};

  const chartData = charts.ticketsPerDay || [];
  const recentTickets = tickets.recent || [];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Tableau de bord administrateur
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Vue globale de l’activité de la plateforme
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            title="Utilisateurs"
            value={stats.totalUsers ?? 0}
            color="text-blue-600"
          />
          <StatCard
            title="Agents"
            value={stats.totalAgents ?? 0}
            color="text-violet-600"
          />
          <StatCard
            title="Tickets ouverts"
            value={stats.openTickets ?? 0}
            color="text-orange-600"
          />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Évolution des tickets
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Nombre de tickets créés par jour
            </p>
          </div>

          {chartData.length > 0 ? (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "14px",
                      border: "1px solid #e2e8f0",
                      backgroundColor: "#ffffff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="tickets"
                    stroke="#7c3aed"
                    fill="#c4b5fd"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
              Aucune donnée statistique disponible.
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Tickets récents
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Dernières demandes enregistrées
            </p>
          </div>

          {recentTickets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Sujet</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTickets.slice(0, 5).map((ticket) => (
                    <tr key={ticket.id} className="border-b border-slate-100">
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-900">
                          {ticket.title}
                        </div>
                        <div className="mt-1 max-w-sm line-clamp-1 text-xs text-slate-400">
                          {ticket.description}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            ticket.status
                          )}`}
                        >
                          {formatStatus(ticket.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-500">
                        {new Date(
                          ticket.createdAt || ticket.updatedAt
                        ).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
              Aucun ticket récent disponible.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;