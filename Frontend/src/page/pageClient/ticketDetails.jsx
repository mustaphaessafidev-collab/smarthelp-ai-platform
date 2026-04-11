import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { Send, Paperclip, User } from "lucide-react";
import ticketApi from "../../services/ticketApi";

function TicketDetails() {
  const { id } = useParams();
  const socketRef = useRef(null);

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");

  // Fetch ticket
  const fetchTicket = async () => {
    try {
      const res = await ticketApi.get(`/${id}`);
      setTicket(res.data.ticket);
      setMessages(res.data.ticket.messages || []);
    } catch (error) {
      console.error("Erreur lors de la récupération du ticket :", error);
    } finally {
      setLoading(false);
    }
  };

  // Socket
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

  //  SEND MESSAGE WITH CHECK
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    if (ticket.status === "RESOLVED" || ticket.status === "CLOSED") {
      return;
    }

    try {
      setSending(true);

      await ticketApi.post(`/${id}/messages`, {
        content: newMessage,
        messageType: "USER",
      });

      setNewMessage("");
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur lors de l'envoi du message");
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
      <div className="flex min-h-screen items-center justify-center">
        Chargement...
      </div>
    );
  }

  if (!ticket) {
    return <div>Ticket introuvable</div>;
  }

  const isClosed =
    ticket.status === "RESOLVED" || ticket.status === "CLOSED";

  return (
    <div className="min-h-screen bg-[#f3f4f8] px-4 py-4">
      <div className="mx-auto flex h-[92vh] max-w-5xl flex-col rounded-2xl bg-white shadow">

        {/* HEADER */}
        <div className="border-b p-4">
          <h1 className="font-bold">{ticket.title}</h1>
          <p className="text-sm text-gray-500">{ticket.description}</p>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.type === "USER";

            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-xl max-w-xs ${
                    isUser
                      ? "bg-violet-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {msg.content}
                  <div className="text-xs mt-1 opacity-70">
                    {formatTime(msg.createdAt)}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className={`p-4 border-t ${isClosed ? "bg-gray-100 opacity-60" : ""}`}>

          {/*  MESSAGE IF CLOSED */}
          {isClosed && (
            <div className="mb-2 text-sm text-green-600">
              Ce ticket est fermé. Vous ne pouvez plus envoyer de messages.
            </div>
          )}

          <div className="flex items-center gap-2">
            <button className="p-2">
              <Paperclip size={18} />
            </button>

            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isClosed}
              placeholder={
                isClosed
                  ? "Ticket fermé..."
                  : "Tapez votre message..."
              }
              className="flex-1 resize-none border rounded-lg p-2 disabled:cursor-not-allowed"
            />

            <button
              onClick={handleSendMessage}
              disabled={sending || !newMessage.trim() || isClosed}
              className="bg-violet-500 text-white p-2 rounded-full disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetails;