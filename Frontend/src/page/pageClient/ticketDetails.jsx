import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Send, Paperclip, User } from "lucide-react";

function TicketDetails() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages]);

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
        }
      );

      setNewMessage("");
      fetchTicket();
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const translateStatus = (status) => {
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7fb]">
        <p className="text-sm text-slate-500">Chargement...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7fb]">
        <p className="text-sm text-slate-500">Ticket introuvable.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f8] px-4 py-4 md:px-6">
      <div className="mx-auto flex h-[92vh] max-w-5xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-200 px-5 py-4 md:px-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-lg font-bold text-slate-900">{ticket.title}</h1>
              <p className="mt-1 text-sm text-slate-500">{ticket.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                {translateStatus(ticket.status)}
              </span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                {translatePriority(ticket.priority)}
              </span>
            </div>
          </div>
        </div>

        {/* Conversation */}
        <div className="flex-1 overflow-y-auto bg-[#f7f8fc] px-4 py-5 md:px-6">
          <div className="mx-auto max-w-4xl space-y-5">
            
       {ticket.messages?.length > 0 ? (
  ticket.messages.map((message) => {
    const isUser = message.type === "USER";

    return (
      <div
        key={message.id}
        className={`flex items-start gap-3 ${
          isUser ? "justify-end" : "justify-start"
        }`}
      >
        {!isUser && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500">
            <User size={14} />
          </div>
        )}

        <div
          className={`flex w-full max-w-[85%] md:max-w-[50%] flex-col ${
            isUser ? "items-end" : "items-start"
          }`}
        >
          <div
            className={`w-fit max-w-full overflow-hidden break-words [overflow-wrap:anywhere] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
              isUser
                ? "rounded-tr-md bg-violet-500 text-white"
                : "rounded-tl-md border border-slate-200 bg-white text-slate-700"
            }`}
          >
            {message.content}
          </div>

          <span className="mt-1 px-1 text-[11px] text-slate-400">
            {formatTime(message.createdAt)}
            {isUser ? " • Vous" : " • Support"}
          </span>
        </div>

        {isUser && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <User size={14} />
          </div>
        )}
      </div>
    );
  })
) : (
  <p className="text-center text-sm text-slate-500">
    Aucun message pour le moment.
  </p>
)}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#f7f8fc] px-3 py-2">
              <button
                type="button"
                className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              >
                <Paperclip size={18} />
              </button>

              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Tapez votre message..."
                className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent px-1 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />

              <button
                onClick={handleSendMessage}
                disabled={sending || !newMessage.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500 text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>

            <p className="mt-2 text-right text-[11px] text-slate-400">
              Appuyez sur Entrée pour envoyer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetails;