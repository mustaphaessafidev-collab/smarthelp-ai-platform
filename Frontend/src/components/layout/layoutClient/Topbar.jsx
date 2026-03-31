function Topbar() {
  return (
    <header
      style={{
        height: "70px",
        background: "#fff",
        borderBottom: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      <h3>User Directory</h3>
      <div>icons</div>
    </header>
  );
}

export default Topbar;