import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import {
  FiHome,
 
  FiUsers,
  FiUserCheck,
  FiGrid,

} from "react-icons/fi";
import { LuTicketSlash } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";

function Sidebar() {
  const [open, setOpen] = useState(true);

  const menu = [
    { name: "Dashboard", path: "/Admin", icon: <FiHome /> },
    { name: "Tickets", path: "/Admin/tickets-stats", icon: <LuTicketSlash /> },
    { name: "Users", path: "/Admin/users", icon: <FiUsers /> },
    { name: "Agents", path: "/Admin/agent", icon: <FiUserCheck /> },
    { name: "Categories", path: "/Admin/Categories", icon: <FiGrid /> },
    { name: "Profile", path: "/Admin/Profile", icon: <CgProfile /> },
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