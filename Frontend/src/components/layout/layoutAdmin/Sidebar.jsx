import { NavLink } from "react-router-dom";
import { useState } from "react";
import { LayoutDashboard, Menu } from "lucide-react";
import { FiUsers, FiUserCheck, FiGrid } from "react-icons/fi";
import { LuTicketSlash } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";

function Sidebar() {
  const [open, setOpen] = useState(true);

  const menu = [
    {
      name: "Tableau de bord",
      path: "/Admin",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Tickets",
      path: "/Admin/tickets-stats",
      icon: <LuTicketSlash size={20} />,
    },
    {
      name: "Utilisateurs",
      path: "/Admin/users",
      icon: <FiUsers size={20} />,
    },
    {
      name: "Agents",
      path: "/Admin/agent",
      icon: <FiUserCheck size={20} />,
    },
    {
      name: "Catégories",
      path: "/Admin/Categories",
      icon: <FiGrid size={20} />,
    },
    {
      name: "Profil",
      path: "/Admin/Profile",
      icon: <CgProfile size={20} />,
    },
  ];

  return (
    <aside
      className={`${
        open ? "w-[260px]" : "w-[80px]"
      } bg-white border-r border-gray-200 p-4 h-screen transition-all duration-300`}
    >
      {/* TOP */}
      <div className="flex items-center justify-between">
        {open && (
          <h2 className="text-xl font-bold text-indigo-600">
            SmartHelp
          </h2>
        )}

        <button onClick={() => setOpen(!open)}>
          <Menu />
        </button>
      </div>

      {/* MENU */}
      <div className="mt-8 flex flex-col gap-3">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/Admin"}   
            className={({ isActive }) =>
              `flex items-center ${
                open ? "gap-3 px-4 justify-start" : "justify-center"
              } py-3 rounded-lg transition
              ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {open && <span>{item.name}</span>}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;