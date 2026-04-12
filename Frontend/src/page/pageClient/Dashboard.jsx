import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, Ticket, CircleAlert, CircleCheckBig, Clock3 } from "lucide-react";

function UserDashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/tickets/my-tickets", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setTickets(response.data.tickets || []);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des tickets :", error);
      });
  }, []);

  const totalTickets = tickets.length;
  const newTickets = tickets.filter((ticket) => ticket.status === "NEW").length;
  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "IN_PROGRESS",
  ).length;
  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "RESOLVED",
  ).length;

  const recentTickets = [...tickets].slice(0, 5);

  const getStatusStyle = (status) => {
    switch (status) {
      case "NEW":
        return "bg-violet-100 text-violet-700";
      case "OPEN":
        return "bg-yellow-100 text-yellow-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      case "RESOLVED":
        return "bg-green-100 text-green-700";
      case "CLOSED":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case "NEW":
        return "Nouveau";
      case "OPEN":
        return "Ouvert";
      case "IN_PROGRESS":
        return "En cours";
      case "RESOLVED":
        return "Résolu";
      case "CLOSED":
        return "Fermé";
      default:
        return status;
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "HIGH":
        return "text-red-500 font-semibold";
      case "MEDIUM":
        return "text-gray-600 font-medium";
      case "LOW":
        return "text-blue-500 font-medium";
      default:
        return "text-gray-500";
    }
  };

  const translatePriority = (priority) => {
    switch (priority) {
      case "HIGH":
        return "Élevée";
      case "MEDIUM":
        return "Moyenne";
      case "LOW":
        return "Faible";
      default:
        return priority;
    }
  };

  const StatCard = ({ title, value, icon: Icon, iconBg, iconColor }) => (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between hover:shadow-md transition">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">{value}</h2>
      </div>

      <div className={`p-3 rounded-2xl ${iconBg}`}>
        <Icon className={iconColor} size={22} />
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tableau de bord</h1>
          <p className="mt-1 text-sm text-slate-500">
            Consultez un aperçu rapide de vos tickets.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total des tickets"
            value={totalTickets}
            icon={Ticket}
            iconBg="bg-violet-100"
            iconColor="text-violet-600"
          />

          <StatCard
            title="Nouveaux"
            value={newTickets}
            icon={CircleAlert}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />

          <StatCard
            title="En cours"
            value={inProgressTickets}
            icon={Clock3}
            iconBg="bg-orange-100"
            iconColor="text-orange-600"
          />

          <StatCard
            title="Résolus"
            value={resolvedTickets}
            icon={CircleCheckBig}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-semibold text-slate-900">
              Tickets récents
            </h2>

            <button
              onClick={() => navigate("/User/MyTickets")}
              className="text-sm font-medium text-violet-600 hover:underline"
            >
              Voir tous les tickets
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr className="uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Titre</th>
                  <th className="px-6 py-4">Priorité</th>
                  <th className="px-6 py-4">Catégorie</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Date de création</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {recentTickets.length > 0 ? (
                  recentTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-t border-slate-200 transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {ticket.title}
                      </td>

                      <td
                        className={`px-6 py-4 ${getPriorityStyle(ticket.priority)}`}
                      >
                        {translatePriority(ticket.priority)}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {ticket.category?.name || "Aucune catégorie"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full whitespace-nowrap  px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            ticket.status,
                          )}`}
                        >
                          {translateStatus(ticket.status)}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {new Date(ticket.createdAt).toLocaleDateString("fr-FR")}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            navigate(`/User/TicketDetails/${ticket.id}`)
                          }
                          className="rounded-full p-2 text-violet-600 hover:bg-violet-50"
                          title="Voir"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-500">
                      Aucun ticket trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
