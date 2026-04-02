import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useNavigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";

const RegisterPage = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  let navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const getPasswordStrength = () => {
    const len = data.password.length;
    if (len === 0) return { score: 0, label: "" };
    if (len < 5) return { score: 1, label: "Faible" };
    if (len < 8) return { score: 2, label: "Moyen" };
    return { score: 3, label: "Fort" };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        !data.firstName.trim() ||
        !data.lastName.trim() ||
        !data.email.trim() ||
        !data.password ||
        !data.confirmPassword
      ) {
        alert("Veuillez remplir tous les champs.");
        return;
      }

      if (data.password !== data.confirmPassword) {
        alert("Les mots de passe ne correspondent pas.");
        return;
      }

      const { confirmPassword, ...userData } = data;

      await api.post("/auth/register", userData);

      localStorage.setItem("verifyEmail", data.email.trim().toLowerCase());
      navigate("/verify-code");
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || "Échec de l'inscription");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setGoogleLoading(true);

      const idToken = credentialResponse.credential;

      if (!idToken) {
        alert("Jeton Google introuvable");
        return;
      }

      const res = await api.post("/auth/google-login", {
        idToken,
      });

      const { token, user, message } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      alert(message || "Connexion Google réussie");

      // بدل هاد التوجيه حسب المشروع ديالك
      navigate("/User");
    } catch (e) {
      console.error("Google login error:", e);
      alert(e.response?.data?.message || "Échec de la connexion avec Google");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    alert("La connexion Google a échoué");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#f8f9fc] font-sans antialiased">
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-500 rounded-full">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
          </svg>
        </div>
        <span className="text-2xl font-bold text-indigo-600 tracking-tight">
          SmartHelp AI
        </span>
      </div>

      <div className="bg-white rounded-[24px] p-8 sm:p-10 w-full max-w-[480px] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
            Créer un compte
          </h1>
          <p className="text-[15px] text-slate-500">
            Rejoignez des milliers d’utilisateurs qui profitent de l’assistance par IA.
          </p>
        </div>

        <div className="mb-6">
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="signup_with"
              shape="pill"
              width="320"
            />
          </div>

          {googleLoading && (
            <p className="text-center text-sm text-slate-500 mt-3">
              Connexion avec Google...
            </p>
          )}
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-slate-400">ou inscrivez-vous avec votre e-mail</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Prénom</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-400 pointer-events-none">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                type="text"
                name="firstName"
                placeholder="Jean"
                value={data.firstName}
                onChange={handleChange}
                className="w-full py-3 pl-11 pr-4 text-[15px] border border-slate-200 rounded-xl bg-white text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Nom</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-400 pointer-events-none">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                type="text"
                name="lastName"
                placeholder="Dupont"
                value={data.lastName}
                onChange={handleChange}
                className="w-full py-3 pl-11 pr-4 text-[15px] border border-slate-200 rounded-xl bg-white text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Adresse e-mail</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-400 pointer-events-none">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
              <input
                type="email"
                name="email"
                placeholder="nom@exemple.com"
                value={data.email}
                onChange={handleChange}
                className="w-full py-3 pl-11 pr-4 text-[15px] border border-slate-200 rounded-xl bg-white text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Mot de passe</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-400 pointer-events-none">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={data.password}
                onChange={handleChange}
                className="w-full py-3 pl-11 pr-12 text-[15px] border border-slate-200 rounded-xl bg-white text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 text-slate-400 hover:text-slate-500 transition-colors bg-transparent border-none p-1 flex outline-none"
              >
                {showPassword ? "Masquer" : "Afficher"}
              </button>
            </div>

            <div className="mt-1">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((index) => {
                  let bgColor = "bg-slate-200";
                  if (strength.score >= index) {
                    if (strength.score === 1) bgColor = "bg-red-400";
                    else if (strength.score === 2) bgColor = "bg-amber-400";
                    else bgColor = "bg-indigo-500";
                  }
                  return (
                    <div
                      key={index}
                      className={`h-1 w-full rounded-full transition-colors duration-300 ${bgColor}`}
                    ></div>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5 mt-2 text-[13px] text-slate-500 tracking-tight">
                <span>
                  Niveau :{" "}
                  <span className="font-semibold text-indigo-500">
                    {strength.label || "Aucun"}
                  </span>{" "}
                  . Utilisez 8 caractères ou plus.
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-1">
            <label className="text-sm font-semibold text-slate-700">Confirmer le mot de passe</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-400 pointer-events-none">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={data.confirmPassword}
                onChange={handleChange}
                className="w-full py-3 pl-11 pr-4 text-[15px] border border-slate-200 rounded-xl bg-white text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3.5 bg-indigo-500 text-white rounded-xl text-[15px] font-semibold flex justify-center items-center gap-2 transition-all hover:bg-indigo-600 active:scale-[0.98] shadow-sm shadow-indigo-500/20"
          >
            S’inscrire
          </button>
        </form>
      </div>

      <div className="text-center mt-5 flex flex-col gap-6">
        <p className="text-sm text-slate-500 m-0">
          Vous avez déjà un compte ?{" "}
          <Link
            to="/login"
            className="text-indigo-500 font-semibold no-underline hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;