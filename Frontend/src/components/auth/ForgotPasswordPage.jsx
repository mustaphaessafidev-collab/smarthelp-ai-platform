import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

const ForgotPasswordPage = () => {

  const [email,setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e)=>{
    e.preventDefault();

    try{

      const res = await api.post("/auth/forgot-password",{ email });

      alert(res.data.message);

      localStorage.setItem("resetEmail",email);

      navigate("/reset-password");

    }catch(e){
      alert(e.response?.data?.message || "Erreur");
    }

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f8fb] p-5">

      <div className="bg-white rounded-[30px] p-10 w-full max-w-[450px] shadow-[0_15px_35px_rgba(0,0,0,0.04)]">

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Mot de passe oublié
        </h1>

        <p className="text-slate-500 text-sm mb-6">
          Entrez votre adresse e-mail pour recevoir le code de réinitialisation.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <input
            type="email"
            placeholder="nom@email.com"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full py-3 px-4 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />

          <button
            type="submit"
            className="w-full p-3.5 bg-gradient-to-br from-violet-600 to-indigo-500 text-white border-none rounded-full text-base font-semibold cursor-pointer flex justify-center items-center gap-2 transition-all shadow-[0_4px_12px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_16px_rgba(99,102,241,0.4)] active:scale-[0.98]"
          >
            Envoyer le code
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

        </form>

        <p className="text-sm text-center mt-6">
          <Link to="/login" className="text-indigo-500 font-semibold">
            Retour au login
          </Link>
        </p>

      </div>

    </div>
  );
};

export default ForgotPasswordPage;