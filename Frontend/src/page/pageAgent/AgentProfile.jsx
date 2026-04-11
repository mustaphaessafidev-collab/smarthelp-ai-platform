import { useEffect, useState } from "react";
import api from "../../services/api";

const BASE_URL = "http://localhost:4001";

function AgentProfile() {
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

  // fetch profile
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
    } catch {
      alert("Erreur chargement profil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // handle inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
    } catch {
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

        <h1 className="text-3xl font-bold">Agent Profile</h1>

        {/* PROFILE CARD */}
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

            <label className="absolute bottom-0 right-0 bg-violet-600 text-white p-2 rounded-full cursor-pointer">
              ✏️
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

            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
              {profile.role}
            </span>
          </div>
        </div>

        {/* FORMS */}
        <div className="grid grid-cols-2 gap-6">

          {/* UPDATE PROFILE */}
          <form
            onSubmit={handleUpdateProfile}
            className="bg-white p-6 rounded-3xl shadow space-y-4"
          >
            <h3 className="font-bold">Modifier profil</h3>

            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            />

            <input
              type="text"
              name="lastName"
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
              Save changes
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
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 border rounded-xl"
            />

            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 border rounded-xl"
            />

            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 border rounded-xl"
            />

            <button className="bg-black text-white px-4 py-3 rounded-xl">
              Update password
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default AgentProfile;