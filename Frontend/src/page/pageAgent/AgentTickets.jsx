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
      console.error("Categories fetch error:", err);
    }
  };

  const fetchMyTickets = async () => {
    try {
      setError(null);
      const res = await api.get("/tickets/my");
      setTickets(res.data?.tickets || res.data || []);
    } catch (error) {
      console.error("Fetch my tickets error:", error);
      setError("Failed to load your tickets");
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

  useEffect(() => {
    fetchCategories();
    fetchMyTickets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="text-slate-500">Loading your tickets...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">My Assigned Tickets</h1>
          <p className="text-slate-500 mt-1">Tickets currently assigned to you</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-200">
          {/* HEADER */}
          <div className="grid grid-cols-6 gap-4 p-5 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wide">
            <div>Subject</div>
            <div>Status</div>
            <div>Category</div>
            <div>Priority</div>
            <div>Date</div>
            <div>Actions</div>
          </div>

          {/* EMPTY STATE */}
          {tickets.length === 0 && (
            <div className="p-12 text-center">
              <div className="text-slate-400 mb-2">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-slate-500 font-medium">No tickets assigned yet</p>
              <p className="text-slate-400 text-sm">Go to Available Tickets to take a ticket</p>
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

              {/* DATE */}
              <div className="text-sm text-slate-500">
                {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>

              {/* ACTIONS */}
              <div>
                <button
                  onClick={() => navigate(`/agent/ticket/${ticket.id}`)}
                  className="flex items-center justify-center h-9 w-9 rounded-lg bg-violet-100 text-violet-600 hover:bg-violet-200 transition-colors"
                  title="View ticket"
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
