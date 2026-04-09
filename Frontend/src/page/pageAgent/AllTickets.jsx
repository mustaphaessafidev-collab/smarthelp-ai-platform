import { useEffect, useState } from "react";
import api from "../../services/api";

function AllTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch all tickets
  const fetchTickets = async () => {
    try {
      const res = await api.get("/tickets"); // ✅ مطابق للباك
      setTickets(res.data);
    } catch (error) {
      console.error(error);
      alert("Erreur chargement tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // assign ticket
  const assignTicket = async (id) => {
    try {
      await api.post(`/tickets/${id}/assign`); // ✅ مطابق للباك
      fetchTickets();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur assign");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold">All Tickets</h1>
        <p className="text-slate-500">Manage and take tickets</p>

        <div className="bg-white rounded-3xl shadow overflow-hidden">

          {/* HEADER */}
          <div className="grid grid-cols-6 gap-4 p-4 border-b text-sm font-semibold text-slate-500">
            <div>SUJET</div>
            <div>STATUS</div>
            <div>CATEGORIE</div>
            <div>PRIORITE</div>
            <div>USER</div>
            <div>ACTIONS</div>
          </div>

          {/* EMPTY */}
          {tickets.length === 0 && (
            <div className="p-6 text-center text-slate-400">
              No tickets found
            </div>
          )}

          {/* LIST */}
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="grid grid-cols-6 gap-4 p-4 border-b items-center"
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
                {ticket.categoryId || "N/A"}
              </div>

              {/* PRIORITY */}
              <div>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
                  {ticket.priority}
                </span>
              </div>

              {/* USER */}
              <div className="text-sm">
                {ticket.user?.email || ticket.createdBy}
              </div>

              {/* ACTION */}
              <div>
                {ticket.assignedTo  ? (
                  <span className="text-green-600 text-sm font-semibold">
                    Taken
                  </span>
                ) : (
                  <button
                    onClick={() => assignTicket(ticket.id)}
                    className="bg-violet-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-violet-700"
                  >
                    Take
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