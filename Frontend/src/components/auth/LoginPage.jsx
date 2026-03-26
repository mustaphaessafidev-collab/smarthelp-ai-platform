import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
const LoginPage = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
        remember: false,
    });
    let navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit =async (e) => {
        e.preventDefault();
        // Validate inputs
        try{
            if (!data.email.trim() || !data.password) {
            alert("Please enter both email and password.");
            return;
            }
            // send data to backend
            const {remember,...usedate}=data
            const res= await api.post("/auth/login",usedate)
        // Save data to localStorage
            localStorage.setItem("token", res.data.token);;
            localStorage.setItem("user", JSON.stringify(res.data.user));
            const role =res.data.user.role
        // Show alert on success
            if(role==="ADMIN"){
                navigate("/Admin");
            }else if(role==="AGENT"){
                navigate("/Agent");
            }else if(role==="USER"){
                navigate("/User");
            }else{
                navigate("/page404")
            }
            alert("Sign in successful!");
            
        // Console log the data
            console.log("Logged in data:", data);
        }catch(e){
            console.error(e);
            alert(e.response?.data?.message || "Login failed");
        }

    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-5 relative bg-[#f6f8fb] font-sans antialiased">
            {/* Modern subtle logo in the top left */}
            <div className="absolute top-8 left-10 flex items-center gap-2.5 font-bold text-slate-800 text-base tracking-tight">
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-md"></div>
                <span>SmartHelp AI</span>
            </div>

            <div className="bg-white rounded-[30px] p-12 w-full max-w-[470px] shadow-[0_15px_35px_rgba(0,0,0,0.04),0_5px_15px_rgba(0,0,0,0.02)] mb-6 max-sm:px-6 max-sm:py-10">
                <div className="text-center mb-8">
                    <h1 className="m-0 mb-2 text-[28px] font-bold text-slate-900 tracking-tight">Welcome Back</h1>
                    <p className="m-0 text-[15px] text-slate-500">Sign in to your SmartHelp AI workspace</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-5 flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">Email Address</label>
                        <div className="relative flex items-center">
                            <span className="absolute left-4 text-slate-400 flex pointer-events-none">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                            </span>
                            <input
                                type="email"
                                name="email"
                                className="w-full py-3.5 pl-11 pr-4 text-[15px] border border-slate-200 rounded-full bg-white text-slate-900 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                                placeholder="name@company.com"
                                value={data.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="mb-5 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-semibold text-slate-700">Password</label>
                            <a href="#forgot" className="text-[13px] text-indigo-500 font-semibold no-underline transition-colors hover:text-indigo-600">Forgot Password?</a>
                        </div>
                        <div className="relative flex items-center">
                            <span className="absolute left-4 text-slate-400 flex pointer-events-none">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="w-full py-3.5 pl-11 pr-12 text-[15px] border border-slate-200 rounded-full bg-white text-slate-900 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                                placeholder="••••••••"
                                value={data.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="absolute right-4 bg-transparent border-none text-slate-400 cursor-pointer flex p-1 rounded-full transition-colors hover:text-slate-500 outline-none focus:text-slate-600"
                                onClick={togglePasswordVisibility}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center mb-6 -mt-1">
                        <label className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer">
                            <input
                                type="checkbox"
                                name="remember"
                                className="w-4 h-4 accent-indigo-500 cursor-pointer m-0 rounded border-slate-300"
                                checked={data.remember}
                                onChange={handleChange}
                            />
                            Remember me for 30 days
                        </label>
                    </div>

                    <button type="submit" className="w-full p-3.5 bg-gradient-to-br from-violet-600 to-indigo-500 text-white border-none rounded-full text-base font-semibold cursor-pointer flex justify-center items-center gap-2 transition-all shadow-[0_4px_12px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_16px_rgba(99,102,241,0.4)] active:scale-[0.98]">
                        Sign In
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </button>
                </form>

                <div className="flex items-center my-7 text-center before:content-[''] before:flex-1 before:border-b before:border-slate-200 after:content-[''] after:flex-1 after:border-b after:border-slate-200">
                    <span className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">OR CONTINUE WITH</span>
                </div>

                <div className="flex gap-4">
                    <button type="button" className="flex-1 flex items-center justify-center gap-2.5 p-3 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-700 cursor-pointer transition-colors hover:bg-slate-50 hover:border-slate-300">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                    </button>
                    <button type="button" className="flex-1 flex items-center justify-center gap-2.5 p-3 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-700 cursor-pointer transition-colors hover:bg-slate-50 hover:border-slate-300">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                        GitHub
                    </button>
                </div>
            </div>

            <div className="text-center flex flex-col gap-6">
                <p className="text-sm text-slate-500 m-0">
                    Don't have an account? <Link to="/register" href="#create" className="text-indigo-500 font-semibold no-underline hover:underline">Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
