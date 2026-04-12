import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Send, Paperclip, User, ArrowLeft, Sparkles, Loader, X } from "lucide-react";
import ticketApi from "../../services/ticketApi";

function TicketDetailsAgent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");

  // Fetch ticket and messages
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

  // Initialize Socket.io
  useEffect(() => {
    socketRef.current = io("http://localhost:4002", {
      auth: {
        token,
      },
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to socket server");
      // Join ticket room
      socketRef.current.emit("joinTicket", Number(id));
    });

    // Listen for new messages
    socketRef.current.on("newMessage", (message) => {
      console.log("New message received:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for ticket closed event
    socketRef.current.on("ticketClosed", (data) => {
      console.log("Ticket closed:", data);
      setTicket((prevTicket) => ({
        ...prevTicket,
        status: data.status,
        closedAt: data.closedAt,
      }));
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leaveTicket", Number(id));
        socketRef.current.disconnect();
      }
    };
  }, [id, token]);

  // Fetch ticket on load
  useEffect(() => {
    fetchTicket();
  }, [id]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);

      await ticketApi.post(`/${id}/messages`, {
        content: newMessage,
        messageType: "AGENT",
      });
      
      // Message will be added by socket event
      setNewMessage("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
      alert("Erreur lors de l'envoi du message");
    } finally {
      setSending(false);
    }
  };

  const handleAIHelp = async () => {
    try {
      setAiGenerating(true);

      // Get AI reply from backend
      const res = await ticketApi.post(`/${id}/ai-reply`);
      const aiReply = res.data.reply;

      // Send AI reply as message
      await ticketApi.post(`/${id}/messages`, {
        content: aiReply,
        messageType: "AGENT",
      });

      // Message will be added by socket event, no need to manually update
    } catch (error) {
      console.error("Erreur lors de la génération de la réponse IA :", error);
      alert(
        error.response?.data?.message ||
          "Erreur lors de la génération de la réponse IA"
      );
    } finally {
      setAiGenerating(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!window.confirm("Are you sure you want to close this ticket?")) {
      return;
    }

    try {
      setSending(true);
      const res = await ticketApi.put(`/${id}/close`);
      
      if (res.data && res.data.ticket) {
        setTicket(res.data.ticket);
        alert("✓ Ticket closed successfully!");
      }
    } catch (error) {
      console.error("Error closing ticket:", error);
      
      let errorMessage = "Error closing ticket";
      
      if (error.response?.status === 403) {
        errorMessage = "Only the assigned agent can close this ticket";
      } else if (error.response?.status === 404) {
        errorMessage = "Ticket not found";
      } else if (error.response?.status === 401) {
        errorMessage = "You are not authorized to close this ticket";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
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
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const translateStatus = (status) => {
    switch (status) {
      case "NEW":
        return "New";
      case "OPEN":
        return "Open";
      case "IN_PROGRESS":
        return "In Progress";
      case "PENDING":
        return "Pending";
      case "RESOLVED":
        return "Resolved";
      case "CLOSED":
        return "Closed";
      default:
        return status;
    }
  };

  const translatePriority = (priority) => {
    switch (priority) {
      case "URGENT":
        return "Urgent";
      case "HIGH":
        return "High";
      case "MEDIUM":
        return "Medium";
      case "LOW":
        return "Low";
      default:
        return priority;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7fb]">
        <p className="text-sm text-slate-500">chargement ... </p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7fb]">
        <p className="text-sm text-slate-500">Ticket Non Trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f8] px-4 py-4 md:px-6">
      <div className="mx-auto flex h-[92vh] max-w-5xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-200 px-5 py-4 md:px-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/Agent/Tickets")}
                className="flex items-center justify-center h-9 w-9 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-lg font-bold text-slate-900">{ticket.title}</h1>
                <p className="mt-1 text-sm text-slate-500">{ticket.description}</p>
                {ticket.attachments && ticket.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {ticket.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={`http://localhost:4002${attachment.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100"
                        title={attachment.fileName}
                      >
                        📎 {attachment.fileName.substring(0, 20)}
                        {attachment.fileName.length > 20 ? "..." : ""}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                {translateStatus(ticket.status)}
              </span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                {translatePriority(ticket.priority)}
              </span>
              {ticket.status !== "RESOLVED" && ticket.status !== "CLOSED" && (
                <>
                  <button
                    onClick={handleAIHelp}
                    disabled={aiGenerating || sending}
                    className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Generate AI-assisted response"
                  >
                    {aiGenerating ? (
                      <>
                        <Loader size={14} className="animate-spin" />
                        Thinking...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        AI Help
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCloseTicket}
                    disabled={sending}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Close this ticket"
                  >
                    <X size={14} />
                    Close
                  </button>
                </>
              )}
              {(ticket.status === "RESOLVED" || ticket.status === "CLOSED") && (
                <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700">
                  ✓ Closed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Conversation */}
        <div className="flex-1 overflow-y-auto bg-[#f7f8fc] px-4 py-5 md:px-6">
          <div className="mx-auto max-w-4xl space-y-5">
            {messages?.length > 0 ? (
              messages.map((message) => {
                const isAgent = message.type === "AGENT";

                return (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      isAgent ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isAgent && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                        <User size={14} />
                      </div>
                    )}

                    <div
                      className={`flex w-full max-w-[85%] md:max-w-[50%] flex-col ${
                        isAgent ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`w-fit max-w-full overflow-hidden break-words [overflow-wrap:anywhere] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                          isAgent
                            ? "rounded-tr-md bg-violet-500 text-white"
                            : "rounded-tl-md border border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        {message.content}
                      </div>

                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 flex flex-col gap-2">
                          {message.attachments.map((attachment) => {
                            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(
                              attachment.fileName
                            );
                            return isImage ? (
                              <img
                                key={attachment.id}
                                src={`http://localhost:4002${attachment.fileUrl}`}
                                alt={attachment.fileName}
                                className="max-w-xs rounded-lg shadow-md"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              <a
                                key={attachment.id}
                                href={`http://localhost:4002${attachment.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100"
                              >
                                📎 {attachment.fileName}
                              </a>
                            );
                          })}
                        </div>
                      )}

                      <span className="mt-1 px-1 text-[11px] text-slate-400">
                        {formatTime(message.createdAt)}
                        {isAgent ? " • You" : " • Customer"}
                      </span>
                    </div>

                    {isAgent && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                        <User size={14} />
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-center text-sm text-slate-500">
                No messages yet.
              </p>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className={`border-t border-slate-200 bg-white px-4 py-4 md:px-6 ${
          ticket.status === "RESOLVED" || ticket.status === "CLOSED"
            ? "bg-slate-100 opacity-60"
            : ""
        }`}>
          <div className="mx-auto max-w-4xl">
            {(ticket.status === "RESOLVED" || ticket.status === "CLOSED") && (
              <div className="mb-3 rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200">
                ce ticket est fermé. Vous ne pouvez plus envoyer de messages.
              </div>
            )}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#f7f8fc] px-3 py-2">
              <button
                type="button"
                disabled={
                  ticket.status === "RESOLVED" || ticket.status === "CLOSED"
                }
                className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Paperclip size={18} />
              </button>

              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={
                  ticket.status === "RESOLVED" || ticket.status === "CLOSED"
                }
                rows={1}
                placeholder={
                  ticket.status === "RESOLVED" || ticket.status === "CLOSED"
                    ? "This ticket is closed..."
                    : "Type your message..."
                }
                className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent px-1 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
              />

              <button
                onClick={handleSendMessage}
                disabled={
                  sending ||
                  !newMessage.trim() ||
                  ticket.status === "RESOLVED" ||
                  ticket.status === "CLOSED"
                }
                className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500 text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>

            <p className="mt-2 text-right text-[11px] text-slate-400">
              {ticket.status === "RESOLVED" || ticket.status === "CLOSED"
                ? "Ticket is closed"
                : "Press Enter to send"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetailsAgent;
