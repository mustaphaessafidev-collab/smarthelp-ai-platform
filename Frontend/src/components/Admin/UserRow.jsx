function UserRow({ user }) {
  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>
        <span
          style={{
            color: user.status === "Active" ? "green" : "gray",
          }}
        >
          {user.status}
        </span>
      </td>
      <td>{user.joinedDate}</td>
      <td>
        ✏️ 🗑️
      </td>
    </tr>
  );
}

export default UserRow;