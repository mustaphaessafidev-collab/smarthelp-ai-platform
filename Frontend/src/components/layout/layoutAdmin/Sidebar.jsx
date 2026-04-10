import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FiHome,
  FiFileText,
  FiUsers,
  FiUserCheck,
  FiGrid,
  FiUser,
  FiMenu,
  FiX,
} from "react-icons/fi";

function Sidebar() {
  const [open, setOpen] = useState(true);

  const menu = [
    { name: "Dashboard", path: "/Admin", icon: FiHome },
    { name: "Tickets", path: "/Admin/tickets-stats", icon: FiFileText },
    { name: "Users", path: "/Admin/users", icon: FiUsers },
    { name: "Agents", path: "/Admin/agent", icon: FiUserCheck },
    { name: "Categories", path: "/Admin/Categories", icon: FiGrid },
    { name: "Profile", path: "/Admin/Profile", icon: FiUser },
  ];

  return (
    <aside
      className={`${
        open ? "w-[280px]" : "w-[100px]"
      } bg-white border-r border-slate-200 h-screen transition-all duration-300 shadow-sm flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        {open && (
          <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            SmartHelp
          </h2>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-6 px-4 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={!open ? item.name : ""}
              className={({ isActive }) =>
                `flex items-center ${
                  open ? "gap-3 px-4 justify-start" : "gap-0 px-4 justify-center"
                } py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-violet-100 text-violet-600 font-semibold shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <Icon size={20} className="flex-shrink-0" />
              {open && <span className="text-sm font-medium">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        {open && (
          <div className="text-xs text-slate-500 text-center">
            <p>SmartHelp AI v1.0</p>
            <p className="mt-1">© 2026</p>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;