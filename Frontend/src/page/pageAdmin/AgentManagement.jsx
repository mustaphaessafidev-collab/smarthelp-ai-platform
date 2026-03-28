import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Pencil, UserX, ChevronLeft, ChevronRight } from "lucide-react";
import { AddAgent, deleteAgent, getAgentOnly, updateAgent } from "../../services/adminService";


function AgentManagement() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const itemsPerPage = 4;
    const [data, setData] = useState({
           firstName: "",
           lastName:"",
           email: "",
           password: "",
           
    });
    
    const closeModal = () => {
      setShowModal(false);
      setIsEditMode(false);
      setSelectedAgentId(null);
      setData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (
      !data.firstName.trim() ||
      !data.lastName.trim() ||
      !data.email.trim() ||
      !data.password.trim()
    ) {
      alert("Please fill out all fields.");
      return;
    }

    await AddAgent(data);

    setData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });

    setShowModal(false);
    fetchAgents();
  } catch (e) {
    console.error(e);
    alert(e.response?.data?.message || "Add agent failed");
  }
};


  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAgentOnly();
      setAgents(data?.users || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleEditClick = (agent) => {
  setIsEditMode(true);
  setSelectedAgentId(agent.id);
  setShowModal(true);

    setData({
      firstName: agent.firstName || "",
      lastName: agent.lastName || "",
      email: agent.email || "",
      password: "",
    });
  };

  const handleUpdateSubmit = async (e) => {
  e.preventDefault();

  try {
    if (
      !data.firstName.trim() ||
      !data.lastName.trim() ||
      !data.email.trim()
    ) {
      alert("Please fill out first name, last name, and email.");
      return;
    }

    await updateAgent(selectedAgentId, data);

    setData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });

    setSelectedAgentId(null);
    setIsEditMode(false);
    setShowModal(false);
    fetchAgents();
  } catch (e) {
    console.error(e);
    alert(e.response?.data?.message || "Update agent failed");
  }
};

  const filteredAgents = useMemo(() => {
    let result = [...agents];

    if (search.trim()) {
      const value = search.toLowerCase();
      result = result.filter(
        (agent) =>
          `${agent.firstName} ${agent.lastName}`.toLowerCase().includes(value) ||
          agent.email.toLowerCase().includes(value)
      );
    }

    if (statusFilter !== "ALL") {
      result = result.filter((agent) =>
        statusFilter === "ACTIVE" ? agent.isVerified : !agent.isVerified
      );
    }

    return result;
  }, [agents, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredAgents.length / itemsPerPage));

  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Loading agents...</p>
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


// delete Agent
  const handleDelete = async (id) => {
  try {
    if (!confirm("Delete this worker?")) return;
    await deleteAgent(id);
    fetchAgents(); 
  } catch (error) {
    console.error(error);
    alert("Failed to delete agent");
  }
};







  return (
        <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Agent Management
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                Manage your support agents, access, and permissions.
                </p>
            </div>


{/* ADD agent form */}
<button
  onClick={() => setShowModal(true)}
  className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
>
  Add New User
</button>
        </div>

        {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  {isEditMode ? "Update Agent" : "Add Agent"}
                </h3>
                <button
                onClick={closeModal}
                className="rounded-lg px-3 py-1 text-slate-500 hover:bg-slate-100"
                >
                X
                </button>
            </div>

      <form className="space-y-4"onSubmit={isEditMode ? handleUpdateSubmit : handleSubmit}>
        <input
          type="text"
          placeholder="First name"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
            name="firstName"
            onChange={handleChange}
            value={data.firstName}
        />
        <input
          type="text"
          placeholder="Last name"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
            onChange={handleChange}
            name="lastName"
            value={data.lastName}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
            onChange={handleChange}
            name="email"
            value={data.email}
        />
        <input
          type="password"
          placeholder={isEditMode ? "New password (optional)" : "Password"}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
            onChange={handleChange}
            name="password"
            value={data.password}
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="rounded-xl border border-slate-200 px-4 py-2 text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-violet-600 px-4 py-2 font-medium text-white hover:bg-violet-700"
          >
            {isEditMode ? "Update Agent" : "Save Agent"}
          </button>
        </div>
      </form>
    </div>
  </div>
  )}


{/* map datat tabel */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {paginatedAgents.length > 0 ? (
                  paginatedAgents.map((agent) => (
                    <tr key={agent.id} className="transition hover:bg-slate-50/70">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
                            {agent.firstName?.[0]}
                            {agent.lastName?.[0]}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {agent.firstName} {agent.lastName}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">{agent.email}</td>

                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {agent.role}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 text-sm font-medium ${
                            agent.isVerified ? "text-emerald-600" : "text-slate-400"
                          }`}
                        >
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              agent.isVerified ? "bg-emerald-500" : "bg-slate-300"
                            }`}
                          />
                          {agent.isVerified ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(agent.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button onClick={() => handleEditClick(agent)} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-violet-600">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() =>handleDelete(agent.id)} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-red-500">
                            <UserX size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-sm text-slate-500">
                      No agents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredAgents.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(currentPage * itemsPerPage, filteredAgents.length)}
              </span>{" "}
              of <span className="font-semibold text-slate-700">{filteredAgents.length}</span>{" "}
              agents
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 w-9 rounded-xl text-sm font-semibold transition ${
                    currentPage === page
                      ? "bg-violet-600 text-white shadow-md"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentManagement;