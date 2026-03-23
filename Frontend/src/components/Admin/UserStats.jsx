function UserStats() {
  return (
    <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
      <div className="card">
        <h4>Total Users</h4>
        <p>48</p>
      </div>

      <div className="card">
        <h4>Active</h4>
        <p>35</p>
      </div>

      <div className="card">
        <h4>Inactive</h4>
        <p>13</p>
      </div>
    </div>
  );
}

export default UserStats;