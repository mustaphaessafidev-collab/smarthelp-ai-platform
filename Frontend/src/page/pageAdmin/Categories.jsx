import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

function Categories() {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [data, setData] = useState({
    name: "",
    description: "",
  });

  const fetchCategories = async () => {
    const res = await api.get("/admin/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedId(null);
    setData({ name: "", description: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.name.trim()) return alert("Name required");

    if (isEditMode) {
      await api.put(`/admin/categories/${selectedId}`, data);
    } else {
      await api.post("/admin/categories", data);
    }

    closeModal();
    fetchCategories();
  };

  const handleEdit = (cat) => {
    setIsEditMode(true);
    setSelectedId(cat.id);
    setShowModal(true);
    setData({
      name: cat.name,
      description: cat.description,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete category ?")) return;
    await api.delete(`/admin/categories/${id}`);
    fetchCategories();
  };

  // pagination
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const paginated = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Gestion des catégories
            </h1>
            <p className="text-sm text-slate-500">
              Gérez vos catégories facilement
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
          >
            + Catégorie
          
           
          </button>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                {isEditMode ? "Modifier" : "Ajouter"} catégorie
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Nom"
                  value={data.name}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-xl"
                />

                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={data.description}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-xl"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border rounded-xl"
                  >
                    Annuler
                  </button>

                  <button className="px-4 py-2 bg-violet-600 text-white rounded-xl">
                    {isEditMode ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="mt-6 rounded-3xl border bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-slate-50 text-sm text-slate-500">
              <tr>
                <th className="p-4 text-left">Nom</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium">{cat.name}</td>
                  <td className="p-4 text-slate-500">{cat.description}</td>

                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="p-2 hover:bg-slate-100 rounded-lg"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 hover:bg-slate-100 text-red-500 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex justify-between items-center p-4 border-t">
            <p className="text-sm text-slate-500">
              {categories.length} catégories
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                <ChevronLeft />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-violet-600 text-white"
                      : "border"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categories;