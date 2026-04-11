import { NavLink } from "react-router-dom";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { LuTicketSlash } from "react-icons/lu";
import { IoAddOutline } from "react-icons/io5";
import { LayoutDashboard, Menu } from "lucide-react";
import { FiHome } from "react-icons/fi";

function Sidebar() {
  const [open, setOpen] = useState(true);

  const menu = [
    { name: "Tableau de bord", path: "/User", icon: <LayoutDashboard /> },
    { name: "Mes Tickets", path: "/User/MyTickets", icon: <LuTicketSlash /> },
    { name: "Créer un ticket", path: "/User/CreateTicket", icon: <IoAddOutline /> },
    { name: "Profil", path: "/User/Profile", icon: <CgProfile /> },
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

        {/* BUTTON */}
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

            {/* TEXT */}
            {open && <span>{item.name}</span>}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;