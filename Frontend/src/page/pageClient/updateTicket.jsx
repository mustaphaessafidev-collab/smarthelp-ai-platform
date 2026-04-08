import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function UpdateTicket() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    priority: "LOW",
    attachments: [],
  });

  const [existingAttachments, setExistingAttachments] = useState([]);
  const [removeAttachments, setRemoveAttachments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [ticketRes, categoriesRes] = await Promise.all([
          axios.get(`http://localhost:4000/api/tickets/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://localhost:4000/api/tickets/categories"),
        ]);

        const ticket = ticketRes.data.ticket;

        setFormData({
          title: ticket.title || "",
          description: ticket.description || "",
          categoryId: ticket.categoryId || "",
          priority: ticket.priority || "LOW",
          attachments: [],
        });

        setExistingAttachments(ticket.attachments || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error("Erreur lors du chargement du ticket :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      attachments: files,
    }));
  };

  const handleRemoveExistingAttachment = (attachmentId) => {
    setExistingAttachments((prev) =>
      prev.filter((file) => file.id !== attachmentId)
    );

    setRemoveAttachments((prev) => [...prev, attachmentId]);
  };

  const removeNewAttachment = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("priority", formData.priority);
      data.append("categoryId", formData.categoryId || "");

      removeAttachments.forEach((id) => {
        data.append("removeAttachments", id);
      });

      formData.attachments.forEach((file) => {
        data.append("attachments", file);
      });

      await axios.put(`http://localhost:4000/api/tickets/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/User/MyTickets");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-4 py-5 md:px-6 md:py-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-slate-900">
            Modifier le ticket
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Mettez à jour les informations de votre ticket.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"
        >
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Titre du ticket
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-400"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Catégorie
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-400"
                >
                  <option value="">Choisir une catégorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Priorité
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-400"
                >
                  <option value="LOW">Faible</option>
                  <option value="MEDIUM">Moyenne</option>
                  <option value="HIGH">Élevée</option>
                  <option value="URGENT">Urgente</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Anciennes pièces jointes
              </label>

              {existingAttachments.length > 0 ? (
                <div className="space-y-2">
                  {existingAttachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {file.fileName}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingAttachment(file.id)}
                        className="text-sm font-medium text-red-500 hover:text-red-600"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  Aucune pièce jointe existante.
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Nouvelles pièces jointes
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-violet-200 bg-[#f8f7ff] px-5 py-8 text-center transition hover:bg-violet-50">
                <div className="mb-2 text-2xl text-violet-500">☁</div>
                <p className="text-sm font-medium text-slate-700">
                  Ajouter des fichiers
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  PNG, JPG ou PDF
                </p>

                <input
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg,.pdf"
                  className="hidden"
                  onChange={handleFilesChange}
                />
              </label>

              {formData.attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-700">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeNewAttachment(index)}
                        className="ml-4 text-sm font-medium text-red-500 hover:text-red-600"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/User/MyTickets")}
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 disabled:opacity-60"
              >
                {submitting ? "Enregistrement..." : "Mettre à jour"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateTicket;