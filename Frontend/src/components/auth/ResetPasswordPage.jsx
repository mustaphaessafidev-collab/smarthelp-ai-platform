import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const ResetPasswordPage = ()=>{

  const [code,setCode] = useState("");
  const [password,setPassword] = useState("");

  const navigate = useNavigate();

  const email = localStorage.getItem("resetEmail");

  const handleSubmit = async (e)=>{
    e.preventDefault();

    try{

      const res = await api.post("/auth/reset-password",{
        email,
        code,
        newPassword:password
      });

      alert(res.data.message);

      localStorage.removeItem("resetEmail");

      navigate("/login");

    }catch(e){
      alert(e.response?.data?.message || "Erreur");
    }

  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#f6f8fb] p-5">

      <div className="bg-white rounded-[30px] p-10 w-full max-w-[450px] shadow-[0_15px_35px_rgba(0,0,0,0.04)]">

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Réinitialiser le mot de passe
        </h1>

        <p className="text-slate-500 text-sm mb-6">
          Entrez le code reçu par e-mail et votre nouveau mot de passe.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <input
            type="text"
            placeholder="Code reçu par email"
            value={code}
            onChange={(e)=>setCode(e.target.value)}
            className="w-full py-3 px-4 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />

          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full py-3 px-4 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />

          <button
            type="submit"
            className="w-full py-3 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600"
          >
            Réinitialiser le mot de passe
          </button>

        </form>

      </div>

    </div>

  );

}

export default ResetPasswordPage;