function UserFilters() {
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        marginBottom: "20px",
        background: "#fff",
        padding: "16px",
        borderRadius: "12px",
      }}
    >
      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, email or department..."
        style={{ flex: 1, padding: "10px" }}
      />

      {/* Role Filter */}
      <select>
        <option>All Roles</option>
        <option>Admin</option>
        <option>Agent</option>
        <option>User</option>
      </select>

      {/* Status Filter */}
      <select>
        <option>Status: Active</option>
        <option>Active</option>
        <option>Inactive</option>
      </select>

      {/* Reset */}
      <button>Reset</button>
    </div>
  );
}

export default UserFilters;