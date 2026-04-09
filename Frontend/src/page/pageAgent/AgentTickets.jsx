import { useEffect, useState, useMemo } from "react";
import api from "../../services/api";

function AgentTickets() {
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // fetch my tickets
  const fetchMyTickets = async () => {
    try {
      const res = await api.get("/tickets/my");
      setTickets(res.data || []);
    } catch (error) {
      console.error(error);
      alert("Erreur chargement tickets");
    } finally {
      setLoading(false);
    }
  };

  // map categories
  const categoriesMap = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat.id] = cat.name;
      return acc;
    }, {});
  }, [categories]);

  useEffect(() => {
    fetchCategories();
    fetchMyTickets();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold">My Tickets</h1>
        <p className="text-slate-500">Tickets assigned to you</p>

        <div className="bg-white rounded-3xl shadow overflow-hidden">

          {/* HEADER */}
          <div className="grid grid-cols-5 gap-4 p-4 border-b text-sm font-semibold text-slate-500">
            <div>SUJET</div>
            <div>STATUS</div>
            <div>CATEGORIE</div>
            <div>PRIORITE</div>
            <div>DATE</div>
          </div>

          {/* EMPTY */}
          {tickets.length === 0 && (
            <div className="p-6 text-center text-slate-400">
              No tickets assigned to you
            </div>
          )}

          {/* LIST */}
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="grid grid-cols-5 gap-4 p-4 border-b items-center"
            >
              {/* TITLE */}
              <div>
                <p className="font-semibold">{ticket.title}</p>
                <p className="text-xs text-slate-400 truncate">
                  {ticket.description}
                </p>
              </div>

              {/* STATUS */}
              <div>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                  {ticket.status}
                </span>
              </div>

              {/* CATEGORY */}
              <div>
                {categoriesMap[ticket.categoryId] || "N/A"}
              </div>

              {/* PRIORITY */}
              <div>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
                  {ticket.priority}
                </span>
              </div>

              {/* DATE */}
              <div className="text-sm text-slate-500">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default AgentTickets;