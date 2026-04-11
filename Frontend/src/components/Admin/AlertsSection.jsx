import React from "react";
import { FiAlertTriangle, FiClock } from "react-icons/fi";

export default function AlertsSection({ highPriorityTickets = [], pendingTickets = [] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* High Priority Tickets */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="text-red-600" size={20} />
            <h3 className="text-lg font-bold text-red-900">High Priority Tickets</h3>
          </div>
          <p className="text-sm text-red-700 mt-1">{highPriorityTickets.length} tickets need attention</p>
        </div>

        <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
          {highPriorityTickets.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-slate-500">No high priority tickets</p>
            </div>
          ) : (
            highPriorityTickets.map((ticket) => (
              <div key={ticket.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 truncate">
                      #{ticket.id} - {ticket.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      👤 User #{ticket.createdBy}
                    </p>
                    <p className="text-xs text-slate-500">
                      👨‍💼 {ticket.assignedTo ? `Agent #${ticket.assignedTo}` : "Unassigned"}
                    </p>
                  </div>
                  <span className="flex-shrink-0 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                    🔴 {ticket.priority}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pending Tickets */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <FiClock className="text-purple-600" size={20} />
            <h3 className="text-lg font-bold text-purple-900">Pending Tickets</h3>
          </div>
          <p className="text-sm text-purple-700 mt-1">{pendingTickets.length} tickets awaiting action</p>
        </div>

        <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
          {pendingTickets.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-slate-500">No pending tickets</p>
            </div>
          ) : (
            pendingTickets.map((ticket) => (
              <div key={ticket.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 truncate">
                      #{ticket.id} - {ticket.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      👤 User #{ticket.createdBy}
                    </p>
                    <p className="text-xs text-slate-500">
                      Waiting since {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="flex-shrink-0 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                    ⏳ PENDING
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
