import React from "react";
import { FiExternalLink } from "react-icons/fi";

const getStatusBadge = (status) => {
  const statusConfig = {
    NEW: { bg: "bg-blue-100", text: "text-blue-800", label: "New" },
    OPEN: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Open" },
    IN_PROGRESS: { bg: "bg-orange-100", text: "text-orange-800", label: "In Progress" },
    PENDING: { bg: "bg-purple-100", text: "text-purple-800", label: "Pending" },
    RESOLVED: { bg: "bg-green-100", text: "text-green-800", label: "Resolved" },
    CLOSED: { bg: "bg-gray-100", text: "text-gray-800", label: "Closed" },
  };
  const config = statusConfig[status] || { bg: "bg-gray-100", text: "text-gray-800", label: status };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

const getPriorityBadge = (priority) => {
  const priorityConfig = {
    LOW: { bg: "bg-green-100", text: "text-green-700", icon: "🟢" },
    MEDIUM: { bg: "bg-yellow-100", text: "text-yellow-700", icon: "🟡" },
    HIGH: { bg: "bg-orange-100", text: "text-orange-700", icon: "🟠" },
    URGENT: { bg: "bg-red-100", text: "text-red-700", icon: "🔴" },
  };
  const config = priorityConfig[priority] || { bg: "bg-gray-100", text: "text-gray-700", icon: "⚪" };
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>
      {config.icon} {priority}
    </span>
  );
};

export default function TicketTable({ tickets = [] }) {
  if (!tickets.length) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
        <p className="text-slate-600">No tickets found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700">
                Ticket ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700">
                Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700">
                Priority
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700">
                Created By
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700">
                Assigned To
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-xs font-mono text-slate-600">#{ticket.id}</span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-900 truncate max-w-xs">
                    {ticket.title}
                  </p>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(ticket.status)}
                </td>
                <td className="px-6 py-4">
                  {getPriorityBadge(ticket.priority)}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-700">
                    User #{ticket.createdBy}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-700">
                    {ticket.assignedTo ? `Agent #${ticket.assignedTo}` : "—"}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
