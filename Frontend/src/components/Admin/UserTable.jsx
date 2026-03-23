import UserRow from "./UserRow";

const users = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane.doe@smarthelp.ai",
    role: "Admin",
    status: "Active",
    joinedDate: "Oct 12, 2023",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@smarthelp.ai",
    role: "Agent",
    status: "Active",
    joinedDate: "Nov 05, 2023",
  },
];

function UserTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Joined Date</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <UserRow key={user.id} user={user} />
        ))}
      </tbody>
    </table>
  );
}

export default UserTable;