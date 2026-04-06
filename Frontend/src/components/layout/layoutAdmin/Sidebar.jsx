import { NavLink } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaTachometerAlt, FaUserCog, FaUsers } from "react-icons/fa";

function Sidebar() {
  const menu = [
    { name: "Tableau de bord", path: "/admin", icon: <FaTachometerAlt /> },
    { name: "Gestion des utilisateurs", path: "/admin/users", icon: <FaUsers /> },
    { name: "Gestion des agents", path: "/admin/agent", icon: <FaUserCog /> },
    { name: "Profil", path: "/admin/Profile", icon: <CgProfile /> },
  ];

  return (
    <aside className="w-[260px] bg-white border-r border-gray-200 p-5 h-screen">
      
      {/* LOGO */}
      <h2 className="text-xl font-bold text-indigo-600">
        SmartHelp AI
      </h2>

      {/* MENU */}
      <div className="mt-8 flex flex-col gap-3">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition 
              ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;