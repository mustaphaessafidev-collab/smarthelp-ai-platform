import { NavLink } from "react-router-dom";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaTachometerAlt, FaUserCog, FaUsers } from "react-icons/fa";
import { LayoutDashboard, Menu, Ticket, User } from "lucide-react";

function Sidebar() {
  const [open, setOpen] = useState(true);

const menu = [
  { name: "Tableau de bord", path: "/Agent", icon: <LayoutDashboard size={20} /> },
  { name: "Tous tickets", path: "/Agent/AllTickets", icon: <Ticket size={20} /> },
  { name: "Mes tickets", path: "/Agent/Tickets", icon: <Ticket size={20} /> },
  { name: "Profil", path: "/Agent/Profile", icon: <CgProfile size={20} /> },
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
            title={!open ? item.name : ""} // tooltip ملي يكون مسدود
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