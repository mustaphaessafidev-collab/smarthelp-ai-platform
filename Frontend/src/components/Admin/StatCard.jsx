import React from "react";

export default function StatCard({ title, value, icon: Icon, color, trend, description }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-600 font-medium">{title}</p>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            {value}
          </h3>
          {trend !== undefined && (
            <p className={`text-xs mt-2 font-medium ${trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-slate-500"}`}>
              {trend > 0 ? "↑" : trend < 0 ? "↓" : "→"} {Math.abs(trend)}%
            </p>
          )}
          {description && (
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`rounded-lg p-3 ${color} flex-shrink-0`}>
          <Icon size={28} className="text-white" />
        </div>
      </div>
    </div>
  );
}
