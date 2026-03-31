import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const VerifyCodePage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes = 600 seconds

  const email = localStorage.getItem("verifyEmail");

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Email not found. Please register again.");
      navigate("/register");
      return;
    }

    if (timeLeft <= 0) {
      alert("The verification code has expired. Please register again.");
      return;
    }

    if (!code.trim()) {
      alert("Please enter the verification code.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/verify-code", {
        email,
        code: code.trim(),
      });

      alert(res.data.message || "Email verified successfully");

      localStorage.removeItem("verifyEmail");
      navigate("/User");
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] px-4">
      <div className="w-full max-w-[450px] bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">
          Verify Code
        </h1>

        <p className="text-sm text-slate-500 text-center mb-2">
          Please enter the code sent to your email before the timer ends.
        </p>

        <p
          className={`text-center text-sm font-semibold mb-6 ${
            timeLeft > 60 ? "text-indigo-600" : "text-red-500"
          }`}
        >
          Time remaining: {formatTime(timeLeft)}
        </p>

        {timeLeft <= 0 && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 text-center">
            Your verification code has expired. Please register again to get a new code.
          </div>
        )}

        <form onSubmit={handleVerify} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Verification Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              maxLength={6}
              disabled={timeLeft <= 0}
              className="w-full mt-2 py-3 px-4 text-[15px] border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-100 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={loading || timeLeft <= 0}
            className="w-full py-3.5 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyCodePage;