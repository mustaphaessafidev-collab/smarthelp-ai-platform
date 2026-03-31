import { NavLink } from "react-router-dom";

function Sidebar() {
  const menu = [
    { name: "Dashboard", path: "/User" },
    { name: "My Tickets", path: "/User/MyTickets" },
    { name: "Create Ticket", path: "/User/CreateTicket" },
    { name: "Profile", path: "/User/Profile" },
  ];

  return (
    <aside
      style={{
        width: "260px",
        background: "#fff",
        borderRight: "1px solid #eee",
        padding: "20px",
      }}
    >
      <h2>SmartHelp AI</h2>

      <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              textDecoration: "none",
              padding: "12px 14px",
              borderRadius: "10px",
              color: isActive ? "#5b5ce2" : "#333",
              background: isActive ? "#eef0ff" : "transparent",
              fontWeight: isActive ? "600" : "400",
            })}
          >
            {item.name}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;