import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImage: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

const fetchProfile = async () => {
  try {
    setLoading(true);
    const res = await api.get("/users/profile");
    console.log("profile response:", res.data);

    const user = res.data.user || res.data;

    setProfile(user);

    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      profileImage: user.profileImage || "",
    });
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || "Erreur lors du chargement du profil");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put("/users/profile", formData);
      alert(res.data.message || "Profil mis à jour avec succès");
      fetchProfile();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Échec de la mise à jour du profil");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      alert("Veuillez remplir tous les champs du mot de passe");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    try {
      const res = await api.put("/users/profile/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      alert(res.data.message || "Mot de passe mis à jour avec succès");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Échec de la mise à jour du mot de passe");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          Chargement du profil...
        </div>
      </div>
    )
  }
  

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mon Profil</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gérez vos informations personnelles et votre mot de passe.
          </p>
        </div>

        {/* profile card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-2xl font-bold text-violet-700">
              {profile?.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt="profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  {profile?.firstName?.[0]}
                  {profile?.lastName?.[0]}
                </>
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900">
                {profile?.firstName} {profile?.lastName}
              </h2>
              <p className="text-sm text-slate-600">{profile?.email}</p>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {profile?.role}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                Inscrit le {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "Date inconnue"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* update profile */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Modifier le profil
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <input
                type="text"
                name="firstName"
                placeholder="Prénom"
                value={formData.firstName}
                onChange={handleProfileChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              />

              <input
                type="text"
                name="lastName"
                placeholder="Nom"
                value={formData.lastName}
                onChange={handleProfileChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              />

              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleProfileChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              />

              <input
                type="text"
                name="profileImage"
                placeholder="URL de l'image"
                value={formData.profileImage}
                onChange={handleProfileChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              />

              <button
                type="submit"
                className="rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700"
              >
                Enregistrer les modifications
              </button>
            </form>
          </div>

          {/* update password */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Changer le mot de passe
            </h3>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <input
                type="password"
                name="currentPassword"
                placeholder="Mot de passe actuel"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              />

              <input
                type="password"
                name="newPassword"
                placeholder="Nouveau mot de passe"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmer le nouveau mot de passe"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              />

              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
              >
                Mettre à jour le mot de passe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;