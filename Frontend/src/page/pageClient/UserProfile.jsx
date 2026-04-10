import { useEffect, useState } from "react";
import api from "../../services/api";

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImage: null, // 👈 بدلناها
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

      const user = res.data.user || res.data;

      setProfile(user);

      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        profileImage: null,
      });
    } catch (error) {
      console.error(error);
      alert("Erreur lors du chargement du profil");
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

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profileImage: e.target.files[0],
    }));
  };

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

      alert(res.data.message || "Profil mis à jour");
      fetchProfile();
    } catch (error) {
      console.error(error);
      alert("Erreur update profile");
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords not matching");
      return;
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
    } catch (error) {
      console.error(error);
      alert("Erreur password");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">

        <h1 className="text-3xl font-bold">Mon Profil</h1>

        {/* PROFILE CARD */}
        <div className="bg-white p-6 rounded-3xl shadow">
          <div className="flex items-center gap-6">

            {/* IMAGE */}
                      <div className="relative">
          <img
            src={
              formData.profileImage
                ? URL.createObjectURL(formData.profileImage)
                : profile?.profileImage
                  ? `http://localhost:4001${profile.profileImage}`
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
            </div>
          </div>
        </div>

        {/* FORMS */}
        <div className="grid grid-cols-2 gap-6">

          {/* UPDATE PROFILE */}
          <form
            onSubmit={handleUpdateProfile}
            className="bg-white p-6 rounded-3xl shadow space-y-4"
          >
            <h3 className="font-bold text-lg">Modifier le profil</h3>

            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleProfileChange}
              className="w-full p-3 border rounded-xl"
              placeholder="First name"
            />

            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleProfileChange}
              className="w-full p-3 border rounded-xl"
              placeholder="Last name"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleProfileChange}
              className="w-full p-3 border rounded-xl"
              placeholder="Email"
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
            <h3 className="font-bold text-lg">Changer mot de passe</h3>

            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 border rounded-xl"
              placeholder="Current password"
            />

            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 border rounded-xl"
              placeholder="New password"
            />

            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 border rounded-xl"
              placeholder="Confirm password"
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

export default UserProfile;