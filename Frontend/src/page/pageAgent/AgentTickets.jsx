import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import api from "../../services/api";

function AgentTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/tickets/categories");
      setCategories(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Erreur catégories :", err);
    }
  };

  const fetchMyTickets = async () => {
    try {
      setError(null);
      const res = await api.get("/tickets/my");
      setTickets(res.data?.tickets || res.data || []);
    } catch (error) {
      console.error("Erreur tickets :", error);
      setError("Échec du chargement de vos tickets");
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

  // STATUS (FR)
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

  const translateStatus = (status) => {
    switch (status) {
      case "NEW":
        return "Nouveau";
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

  // PRIORITY (FR)
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

  const translatePriority = (priority) => {
    switch (priority) {
      case "URGENT":
        return "Urgente";
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

  useEffect(() => {
    fetchCategories();
    fetchMyTickets();
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

        {/* TITLE */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Mes tickets assignés
          </h1>
          <p className="text-slate-500 mt-1">
            Tickets actuellement assignés à vous
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* TABLE */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-200">

          {/* HEADER */}
          <div className="grid grid-cols-6 gap-4 p-5 border-b bg-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wide">
            <div>Sujet</div>
            <div>Statut</div>
            <div>Catégorie</div>
            <div>Priorité</div>
            <div>Date</div>
            <div>Actions</div>
          </div>

          {/* EMPTY */}
          {tickets.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-slate-500 font-medium">
                Aucun ticket assigné
              </p>
              <p className="text-slate-400 text-sm">
                Allez dans les tickets disponibles pour en prendre un
              </p>
            </div>
          )}

          {/* LIST */}
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="grid grid-cols-6 gap-4 p-5 border-b items-center hover:bg-slate-50 transition"
            >

              {/* TITLE */}
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 truncate">
                  {ticket.title}
                </p>
                <p className="text-xs text-slate-400 truncate mt-1">
                  {ticket.description}
                </p>
              </div>

              {/* STATUS */}
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                  {translateStatus(ticket.status)}
                </span>
              </div>

              {/* CATEGORY */}
              <div className="text-sm text-slate-600">
                {categoriesMap[ticket.categoryId] || "Sans catégorie"}
              </div>

              {/* PRIORITY */}
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                  {translatePriority(ticket.priority)}
                </span>
              </div>

              {/* DATE */}
              <div className="text-sm text-slate-500">
                {new Date(ticket.createdAt).toLocaleDateString("fr-FR")}
              </div>

              {/* ACTION */}
              <div>
                <button
                  onClick={() => navigate(`/agent/ticket/${ticket.id}`)}
                  className="flex items-center justify-center h-9 w-9 rounded-lg bg-violet-100 text-violet-600 hover:bg-violet-200"
                  title="Voir"
                >
                  <Eye size={18} />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AgentTickets;