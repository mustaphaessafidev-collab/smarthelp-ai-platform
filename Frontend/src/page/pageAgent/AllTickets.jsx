import { useEffect, useState, useMemo } from "react";
import api from "../../services/api";

function AllTickets() {
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/tickets/categories");
      setCategories(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Categories fetch error:", err);
    }
  };

  const fetchTickets = async () => {
    try {
      setError(null);
      const res = await api.get("/tickets");
      setTickets(res.data?.tickets || res.data || []);
    } catch (error) {
      console.error("Fetch tickets error:", error);
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const categoriesMap = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat.id] = cat.name;
      return acc;
    }, {});
  }, [categories]);

  const getStatusColor = (status) => {
    switch (status) {
      case "NEW":
        return "bg-purple-100 text-purple-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      case "RESOLVED":
        return "bg-green-100 text-green-700";
      case "CLOSED":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-100 text-red-700";
      case "HIGH":
        return "bg-orange-100 text-orange-700";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700";
      case "LOW":
        return "bg-green-100 text-green-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const assignTicket = async (id) => {
    try {
      await api.post(`/tickets/${id}/assign`);
      fetchTickets();
    } catch (err) {
      alert(err.response?.data?.message || "Error assigning ticket");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="text-slate-500">Chargement des tickets...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Tickets disponibles</h1>
          <p className="text-slate-500 mt-1">Consultez et prenez des tickets à traiter</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-200">
          {/* HEADER */}
          <div className="grid grid-cols-6 gap-4 p-5 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wide">
            <div>Sujet</div>
  <div>Statut</div>
  <div>Catégorie</div>
  <div>Priorité</div>
  <div>Créé par</div>
  <div>Action</div>
          </div>

          {/* EMPTY STATE */}
          {tickets.length === 0 && (
            <div className="p-12 text-center">
              <div className="text-slate-400 mb-2">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-500 font-medium">Aucun ticket disponible</p>
              <p className="text-slate-400 text-sm">Revenez plus tard pour de nouveaux tickets</p>
            </div>
          )}

          {/* LIST */}
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="grid grid-cols-6 gap-4 p-5 border-b border-slate-100 items-center hover:bg-slate-50 transition-colors"
            >
              {/* TITLE */}
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 truncate">{ticket.title}</p>
                <p className="text-xs text-slate-400 truncate mt-1">{ticket.description}</p>
              </div>

              {/* STATUS */}
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
              </div>

              {/* CATEGORY */}
              <div className="text-sm text-slate-600">
                {categoriesMap[ticket.categoryId] || "Uncategorized"}
              </div>

              {/* PRIORITY */}
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </div>

              {/* USER */}
              <div className="text-sm text-slate-600">
                Utilisateur #{ticket.createdBy}
              </div>

              {/* ACTION */}
              <div>
                {ticket.assignedTo ? (
                  <span className="text-green-600 text-sm font-semibold">✓ Pris</span>
                ) : (
                  <button
                    onClick={() => assignTicket(ticket.id)}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Prendre
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllTickets;