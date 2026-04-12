import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Send, Paperclip, User, ArrowLeft } from "lucide-react";
import ticketApi from "../../services/ticketApi";

function TicketDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const socketRef = useRef(null);

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");

  // FETCH
  const fetchTicket = async () => {
    try {
      const res = await ticketApi.get(`/${id}`);
      setTicket(res.data.ticket);
      setMessages(res.data.ticket.messages || []);
    } catch (error) {
      console.error("Erreur :", error);
    } finally {
      setLoading(false);
    }
  };

  // SOCKET
  useEffect(() => {
    socketRef.current = io("http://localhost:4002", {
      auth: { token },
    });

    socketRef.current.on("connect", () => {
      socketRef.current.emit("joinTicket", Number(id));
    });

    socketRef.current.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketRef.current?.emit("leaveTicket", Number(id));
      socketRef.current?.disconnect();
    };
  }, [id, token]);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // SEND
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    if (ticket.status === "RESOLVED" || ticket.status === "CLOSED") return;

    try {
      setSending(true);

      await ticketApi.post(`/${id}/messages`, {
        content: newMessage,
        messageType: "USER",
      });

      setNewMessage("");
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur lors de l'envoi");
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

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

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
        <p className="text-sm text-slate-500">Ticket introuvable</p>
      </div>
    );
  }

  const isClosed =
    ticket.status === "RESOLVED" || ticket.status === "CLOSED";

  return (
    <div className="min-h-screen bg-[#f3f4f8] px-4 py-4 md:px-6">
      <div className="mx-auto flex h-[92vh] max-w-5xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">

        {/* HEADER */}
        <div className="border-b border-slate-200 px-5 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/User/MyTickets")}
              className="flex items-center justify-center h-9 w-9 rounded-lg text-slate-600 hover:bg-slate-100 transition"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                {ticket.title}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {ticket.description}
              </p>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto bg-[#f7f8fc] px-4 py-5 md:px-6">
          <div className="mx-auto max-w-4xl space-y-5">
            {messages.length > 0 ? (
              messages.map((msg) => {
                const isUser = msg.type === "USER";

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isUser && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                        <User size={14} />
                      </div>
                    )}

                    <div
                      className={`flex w-full max-w-[85%] md:max-w-[50%] flex-col ${
                        isUser ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${
                          isUser
                            ? "rounded-tr-md bg-violet-500 text-white"
                            : "rounded-tl-md border border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        {msg.content}
                      </div>

                      <span className="mt-1 text-[11px] text-slate-400">
                        {formatTime(msg.createdAt)}
                        {isUser ? " • You" : " • Agent"}
                      </span>
                    </div>

                    {isUser && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                        <User size={14} />
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-center text-sm text-slate-500">
                No messages yet
              </p>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* INPUT */}
        <div
          className={`border-t border-slate-200 bg-white px-4 py-4 md:px-6 ${
            isClosed ? "bg-slate-100 opacity-60" : ""
          }`}
        >
          <div className="mx-auto max-w-4xl">
            {isClosed && (
              <div className="mb-3 rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200">
                Ce ticket est fermé. Vous ne pouvez plus envoyer de messages.
              </div>
            )}

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#f7f8fc] px-3 py-2">
              <button
                disabled={isClosed}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-200 disabled:opacity-50"
              >
                <Paperclip size={18} />
              </button>

              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isClosed}
                rows={1}
                placeholder={
                  isClosed
                    ? "Ticket fermé..."
                    : "Tapez votre message..."
                }
                className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent px-1 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />

              <button
                onClick={handleSendMessage}
                disabled={sending || !newMessage.trim() || isClosed}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500 text-white hover:bg-violet-600 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>

            <p className="mt-2 text-right text-[11px] text-slate-400">
              {isClosed ? "Ticket fermé" : "Press Enter to send"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetails;