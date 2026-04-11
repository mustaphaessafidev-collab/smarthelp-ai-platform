import { useEffect, useState } from "react";
import api from "../../services/api";

import { Pencil } from "lucide-react";
const BASE_URL = "http://localhost:4001";

function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImage: null,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/profile");
      const user = res.data.user || res.data;

      setProfile(user);

      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        profileImage: null,
      });
    } catch (error) {
      alert("Erreur chargement profil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // change inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // change image
  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  // update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("email", formData.email);

      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage);
      }

      const res = await api.put("/users/profile", data);

      alert(res.data.message);
      fetchProfile();
    } catch (error) {
      alert("Erreur update profile");
    }
  };

  // password
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return alert("Passwords not matching");
    }

    try {
      const res = await api.put("/users/profile/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      alert(res.data.message);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      alert("Erreur password");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Admin Profile</h1>

        {/* CARD */}
        <div className="bg-white p-6 rounded-3xl shadow flex items-center gap-6">
          {/* IMAGE */}
          <div className="relative">
            <img
              src={
                formData.profileImage
                  ? URL.createObjectURL(formData.profileImage)
                  : profile?.profileImage
                    ? `${BASE_URL}${profile.profileImage}`
                    : "https://via.placeholder.com/150"
              }
              className="w-24 h-24 rounded-full object-cover"
            />

            <label className="absolute bottom-0 right-0 bg-violet-600 text-white p-2 rounded-full cursor-pointer flex items-center justify-center">
              <Pencil size={18} />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div>
            <h2 className="text-xl font-bold">
              {profile.firstName} {profile.lastName}
            </h2>
            <p>{profile.email}</p>

            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
              {profile.role}
            </span>
          </div>
        </div>

        {/* FORMS */}
        <div className="grid grid-cols-2 gap-6">
          {/* PROFILE */}
          <form
            onSubmit={handleUpdateProfile}
            className="bg-white p-6 rounded-3xl shadow space-y-4"
          >
            <h3 className="font-bold">Modifier profil</h3>

            <input
              type="text"
              name="prénom"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            />

            <input
              type="text"
              name="nom"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            />

            <button className="bg-violet-600 text-white px-4 py-3 rounded-xl">
              Enregistrer 
            </button>
          </form>

          {/* PASSWORD */}
          <form
            onSubmit={handleUpdatePassword}
            className="bg-white p-6 rounded-3xl shadow space-y-4"
          >
            <h3 className="font-bold">Changer mot de passe</h3>

            <input
              type="password"
              name="mot de passe actuel"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 border rounded-xl"
            />

            <input
              type="password"
              name="nouveau mot de passe"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 border rounded-xl"
            />

            <input
              type="password"
              name="confirmation mot de passe"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 border rounded-xl"
            />

            <button className="bg-black text-white px-4 py-3 rounded-xl">
              Enregistrer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
