import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  

  const ticketsPerPage = 5;

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

  const getStatusStyle = (status) => {
    switch (status) {
      case "NEW":
        return "bg-violet-100 text-violet-700";
      case "OPEN":
        return "bg-blue-100 text-blue-700";
      case "IN_PROGRESS":
        return "bg-amber-100 text-amber-700";
      case "RESOLVED":
        return "bg-green-100 text-green-700";
      case "CLOSED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-700";
      case "MEDIUM":
        return "bg-blue-100 text-blue-700";
      case "LOW":
        return "bg-slate-100 text-slate-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * ticketsPerPage,
    currentPage * ticketsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, priorityFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Mes tickets</h1>
            <p className="mt-2 text-sm text-slate-500">
              Gérez et suivez vos demandes de support
            </p>
          </div>

          <button className="rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-700">
            + Nouveau ticket
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher par titre ou description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-violet-400"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-400"
              >
                <option value="ALL">Statut : Tous</option>
                <option value="NEW">Nouveau</option>
                <option value="OPEN">Ouvert</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="RESOLVED">Résolu</option>
                <option value="CLOSED">Fermé</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-400"
              >
                <option value="ALL">Priorité : Toutes</option>
                <option value="HIGH">Élevée</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="LOW">Faible</option>
              </select>

              <button
              
                onClick={clearFilters}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-500 hover:bg-slate-100"
              >
                Effacer les filtres
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr className="uppercase tracking-wider text-slate-500">
                 
                  <th className="px-6 py-4">Sujet</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Catégorie</th>
                  <th className="px-6 py-4">Priorité</th>
                  <th className="px-6 py-4">Dernière mise à jour</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>

              <tbody>
                {paginatedTickets.length > 0 ? (
                  paginatedTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-t border-slate-200 transition hover:bg-slate-50"
                    >
                    
                      <td className="px-6 py-5">
                        <div className="font-semibold text-slate-900">
                          {ticket.title}
                        </div>
                        <div className="mt-1 max-w-xs truncate text-xs text-slate-400">
                          {ticket.description}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            ticket.status
                          )}`}
                        >
                          {translateStatus(ticket.status)}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {ticket.category?.name || "Aucune catégorie"}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                            ticket.priority
                          )}`}
                        >
                          {translatePriority(ticket.priority)}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-slate-500">
                        {new Date(
                          ticket.updatedAt || ticket.createdAt
                        ).toLocaleDateString("fr-FR")}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button className="text-lg text-slate-400 hover:text-violet-600">
                          ›
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-slate-500">
                      Aucun ticket trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 px-6 py-4 text-sm text-slate-500 sm:flex-row">
            <p>
              Affichage de{" "}
              {filteredTickets.length === 0
                ? 0
                : (currentPage - 1) * ticketsPerPage + 1}{" "}
              à{" "}
              {Math.min(currentPage * ticketsPerPage, filteredTickets.length)}{" "}
              sur {filteredTickets.length} tickets
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-full px-3 py-2 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(



                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 w-9 rounded-full text-sm font-medium ${
                      currentPage === page
                        ? "bg-violet-600 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="rounded-full px-3 py-2 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyTickets;