import { useEffect, useState } from "react";
import { getUsersOnly } from "../../services/adminService";
import { Eye, Pencil, Trash2 } from "lucide-react";
function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUsersOnly();
      setUsers(data?.users || []);
    } catch (err) {
      console.error(err);
      setError("Échec du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ DELETE FUNCTION
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:4001/user/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        alert("Delete failed");
        return;
      }
      // تحديث UI مباشرة
      setUsers((prev) => prev.filter((user) => user.id !== id));

    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <p className="text-sm font-medium text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Gestion des utilisateurs
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gérez les utilisateurs, les rôles et les autorisations.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Nom</th>
                  <th className="px-6 py-4">E-mail</th>
                  <th className="px-6 py-4">Rôle</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Date d'inscription</th>
                  <th className="px-6 py-4">Actions</th> {/* ✅ */}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="transition hover:bg-slate-50/70">

                      {/* NOM + IMAGE */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              user.profileImage
                                ? `http://localhost:4001${user.profileImage}`
                                : "https://i.pinimg.com/736x/a9/5e/7a/a95e7a415633a614613e757bac4246ed.jpg"
                            }
                            alt="profile"
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {user.firstName} {user.lastName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {user.email}
                      </td>

                      {/* ROLE */}
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {user.role}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 text-sm font-medium ${
                            user.isVerified ? "text-emerald-600" : "text-slate-400"
                          }`}
                        >
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              user.isVerified ? "bg-emerald-500" : "bg-slate-300"
                            }`}
                          />
                          {user.isVerified ? "Actif" : "Inactif"}
                        </span>
                      </td>

                      {/* DATE */}
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      {/* ✅ ACTIONS */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-500 hover:text-red-700 hover:scale-110 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center text-sm text-slate-500"
                    >
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;