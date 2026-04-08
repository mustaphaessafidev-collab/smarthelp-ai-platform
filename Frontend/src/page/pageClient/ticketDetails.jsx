import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function TicketDetails() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const token = localStorage.getItem("token");

  const fetchTicket = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/tickets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTicket(res.data.ticket);
    } catch (error) {
      console.error("Erreur lors de la récupération du ticket :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);

      await axios.post(
        `http://localhost:4000/api/tickets/${id}/messages`,
        { content: newMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setNewMessage("");
      fetchTicket();
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  if (!ticket) {
    return <div className="p-6">Ticket introuvable.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">{ticket.title}</h1>
          <p className="mt-2 text-slate-600">{ticket.description}</p>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-violet-100 px-3 py-1 text-violet-700">
              {ticket.status}
            </span>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">
              {ticket.priority}
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Conversation</h2>

          <div className="mt-5 space-y-4">
            {ticket.messages?.length > 0 ? (
              ticket.messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[50%] break-words whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${
                    message.type === "USER"
                      ? "ml-auto bg-violet-600 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="mt-1 text-xs opacity-70">
                    {new Date(message.createdAt).toLocaleString("fr-FR")}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                Aucun message pour le moment.
              </p>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écrire un message..."
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-400"
            />
            <button
              onClick={handleSendMessage}
              disabled={sending}
              className="rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {sending ? "Envoi..." : "Envoyer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetails;
