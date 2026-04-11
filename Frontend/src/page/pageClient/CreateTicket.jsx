import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateTicket() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [aiResult, setAiResult] = useState({
    summary: "",
    predictedCategory: "",
    suggestedPriority: "",
    suggestedReply: "",
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    priority: "",
    attachments: [],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/tickets/categories",
        );
        const categoriesData = Array.isArray(res.data)
          ? res.data
          : res.data?.categories || [];
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const priorityOptions = [
    { value: "LOW", label: "Basse - Question générale" },
    { value: "MEDIUM", label: "Moyenne - Problème normal" },
    { value: "HIGH", label: "Haute - Problème important" },
    { value: "URGENT", label: "Urgente - Critique" },
  ];

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

  const removeAttachment = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter(
        (_, index) => index !== indexToRemove,
      ),
    }));
  };

  const handleAnalyze = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Le titre et la description sont obligatoires.");
      return;
    }

    try {
      setAnalyzing(true);

      const response = await axios.post(
        "http://localhost:4004/api/ai/analyze-ticket",
        {
          title: formData.title,
          description: formData.description,
          categories,
        },
      );

      const aiData = response.data;

      const matchedCategory = categories.find(
        (cat) =>
          cat.name.trim().toLowerCase() ===
          (aiData.predictedCategory || "").trim().toLowerCase(),
      );

      setAiResult({
        summary: aiData.summary || "",
        predictedCategory: aiData.predictedCategory || "",
        suggestedPriority: aiData.suggestedPriority || "",
        suggestedReply: aiData.suggestedReply || "",
      });

      setFormData((prev) => ({
        ...prev,
        categoryId: matchedCategory ? String(matchedCategory.id) : "",
        priority: aiData.suggestedPriority || "MEDIUM",
      }));
    } catch (error) {
      console.error("Erreur analyse IA :", error);
      alert("Erreur lors de l'analyse IA.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Le titre et la description sont obligatoires.");
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("priority", formData.priority || "MEDIUM");

      if (formData.categoryId) {
        data.append("categoryId", formData.categoryId);
      }

      formData.attachments.forEach((file) => {
        data.append("attachments", file);
      });

      await axios.post("http://localhost:4000/api/tickets/create", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setShowSuccess(true);
    } catch (error) {
      console.error("Erreur lors de la création du ticket :", error);
      alert(
        error?.response?.data?.message ||
          "Une erreur est survenue lors de la création du ticket.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccess = () => {
    setShowSuccess(false);
    navigate("/User/MyTickets");
  };

  const aiPriorityLabel =
    priorityOptions.find((p) => p.value === aiResult.suggestedPriority)
      ?.label || "Pas encore défini";

  return (
    <>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900">
              Créer un nouveau ticket
            </h1>
            <p className="mt-2 text-sm text-[#6b7280]">
              Notre IA analysera votre demande pour l'orienter vers le bon
              expert.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.8fr_0.9fr]">
            {/* LEFT SIDE */}
            <form
              onSubmit={handleSubmit}
              className="rounded-[26px] border border-[#e5e7eb] bg-white p-5 shadow-sm md:p-6"
            >
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#4b5563]">
                    Titre du ticket
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Décrivez brièvement le problème (ex: accès portail facturation impossible)"
                    className="w-full rounded-[18px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-sm text-[#374151] outline-none placeholder:text-[#9ca3af] focus:border-violet-400"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#4b5563]">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Fournissez autant de détails que possible : que s'est-il passé ? Que vous attendiez-vous ?"
                    className="w-full resize-none rounded-[18px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4 text-sm text-[#374151] outline-none placeholder:text-[#9ca3af] focus:border-violet-400"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
                  >
                    {analyzing ? "Analyse en cours..." : "Analyser avec l'IA"}
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#4b5563]">
                      Catégorie
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full rounded-[18px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-sm text-[#374151] outline-none focus:border-violet-400"
                    >
                      <option value="">
                        {loadingCategories
                          ? "Chargement..."
                          : "Sélectionnez une catégorie"}
                      </option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#4b5563]">
                      Priorité
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full rounded-[18px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-sm text-[#374151] outline-none focus:border-violet-400"
                    >
                      <option value="">Sélectionnez la priorité</option>
                      {priorityOptions.map((priority) => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#4b5563]">
                    Pièces jointes
                  </label>

                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-[22px] border-2 border-dashed border-[#d8ccff] bg-[#faf8ff] px-5 py-10 text-center transition hover:bg-violet-50">
                    <div className="mb-3 text-3xl text-violet-500">☁</div>
                    <p className="text-sm font-medium text-[#374151]">
                      Glissez-déposez vos fichiers ici
                    </p>
                    <p className="mt-1 text-xs text-[#9ca3af]">
                      PNG, JPG ou PDF jusqu'à 10MB
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
                            onClick={() => removeAttachment(index)}
                            className="ml-4 text-sm font-medium text-red-500 hover:text-red-600"
                          >
                            Supprimer
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>{" "}
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-[#111827] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f2937] disabled:opacity-60"
                >
                  {submitting ? "Création..." : "Créer le ticket"}
                </button>
              </div>
            </form>

            <div className="space-y-5">
              <div className="rounded-[26px] border border-[#ddd6fe] bg-[#f5f3ff] p-5 shadow-sm">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-violet-500">
                      ✦ Assistant IA
                    </p>
                    <h3 className="mt-3 text-2xl font-bold text-[#1f2937]">
                      Analyse en temps réel
                    </h3>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ede9fe] text-2xl text-[#c4b5fd]">
                    ?
                  </div>
                </div>

                <div className="rounded-[18px] bg-white/80 p-4 text-sm text-[#4b5563] shadow-sm">
                  {aiResult.predictedCategory || aiResult.suggestedPriority ? (
                    <>
                      <p className="leading-6">
                        “Insight IA: Cela ressemble à un problème de{" "}
                        <span className="font-semibold text-violet-600">
                          {aiResult.predictedCategory || "Non détecté"}
                        </span>{" "}
                        avec une priorité{" "}
                        <span className="font-semibold text-violet-600">
                          {aiPriorityLabel}
                        </span>
                        .”
                      </p>
                    </>
                  ) : (
                    <p className="leading-6 text-[#6b7280]">
                      Écrivez le titre et la description, puis cliquez sur{" "}
                      <span className="font-semibold">Analyser avec l'IA</span>.
                    </p>
                  )}
                </div>

                <div className="mt-4 space-y-3 text-sm text-[#4b5563]">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>
                      Catégorie suggérée:{" "}
                      <span className="font-medium text-[#111827]">
                        {aiResult.predictedCategory || "--"}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>
                      Priorité estimée:{" "}
                      <span className="font-medium text-[#111827]">
                        {aiResult.suggestedPriority || "--"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-xl text-green-600">
              ✓
            </div>

            <h3 className="mt-3 text-xl font-bold text-slate-900">
              Ticket créé avec succès
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Votre ticket a été enregistré.
            </p>

            <button
              onClick={handleSuccess}
              className="mt-5 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CreateTicket;
