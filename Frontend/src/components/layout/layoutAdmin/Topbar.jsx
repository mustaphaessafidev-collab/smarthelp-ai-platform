import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
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
        <span className="text-gray-500 mt-2">{user.role}</span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        
        {/* User Info */}
         <div className="flex items-center gap-2">
  
            {user?.profileImage ? (
                <img
                src={user.profileImage}
                alt="user"
                className="w-10 h-10 rounded-full object-cover"
                />
            ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
                </div>
            )}

            <span className="font-medium">
                {user?.firstName}
            </span>

            </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-3 rounded-xl 
                    bg-gradient-to-r from-indigo-600 to-purple-600 
                    text-white font-medium 
                    hover:from-indigo-700 hover:to-purple-700 
                    transition-all duration-200 shadow-md"
        >
          <IoIosLogOut className="text-xl" />
          <span>Logout</span>
        </button>

      </div>
    </header>
  );
}

export default Topbar;