import { Link } from "react-router-dom";
import { AlertCircle, Home, LayoutDashboard } from "lucide-react";

function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <h1 className="font-bold text-lg">SaaSFlow</h1>

        <div className="flex gap-4 items-center">
          <Link to="/login" className="text-sm text-slate-600">
            Log in
          </Link>
          <Link
            to="/signup"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Sign up
          </Link>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col justify-center items-center text-center px-4">

        {/* ICON */}
        <div className="bg-indigo-100 p-6 rounded-full mb-6">
          <AlertCircle className="text-indigo-600" size={40} />
        </div>

        {/* TITLE */}
        <h1 className="text-7xl font-bold text-slate-900">404</h1>
        <h2 className="text-xl font-semibold mt-2">Page not found</h2>

        <p className="text-slate-500 mt-2 max-w-md">
          The page you are looking for doesn’t exist or has been moved.
          Let’s get you back on track.
        </p>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-6">
          <Link
            to="/"
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
          >
            <Home size={16} />
            Go back home
          </Link>

          <Link
            to="/dashboard"
            className="flex items-center gap-2 border px-5 py-2 rounded-lg hover:bg-slate-100"
          >
            <LayoutDashboard size={16} />
            Go to dashboard
          </Link>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 max-w-3xl w-full">
          <div className="bg-white p-4 rounded-xl shadow text-left">
            <h3 className="font-semibold">Documentation</h3>
            <p className="text-sm text-slate-500">Learn how to use app</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow text-left">
            <h3 className="font-semibold">Help Center</h3>
            <p className="text-sm text-slate-500">Find answers to FAQs</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow text-left">
            <h3 className="font-semibold">Status Page</h3>
            <p className="text-sm text-slate-500">Check system status</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center text-sm text-slate-400 py-4">
        © 2024 SaaSFlow. All rights reserved.
      </div>
    </div>
  );
}

export default ErrorPage;