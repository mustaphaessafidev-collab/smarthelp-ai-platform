import { useNavigate } from "react-router-dom";

function Topbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="h-[70px] bg-white border-b border-gray-200 flex items-center justify-between px-6">
      
      {/* LEFT */}
      <div className="flex items-center gap-2">
        <h2 className="text-indigo-600 text-xl font-semibold">
          SmartHelp
        </h2>
        <span className="text-gray-500">Admin</span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        
        {/* User Info */}
        <div className="flex items-center gap-2">
          <img
            src={user?.profileImage || "https://i.pravatar.cc/40"}
            alt="user"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-medium">
            {user?.firstName}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Logout
        </button>

      </div>
    </header>
  );
}

export default Topbar;