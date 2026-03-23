import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "../components/layout/layoutAdmin/AdminLayout";
import Dashboard from "../page/pageAdmin/Dashboard";
import UserManagement from "../page/pageAdmin/UserManagement";
import KnowledgeBase from "../page/pageAdmin/KnowledgeBase";
import Analytics from "../page/pageAdmin/Analytics";
import Settings from "../page/pageAdmin/Settings";

import LoginPage from "../components/auth/LoginPage";
import RegisterPage from "../components/auth/RegisterPage";
import HomePage from "../components/home/HomePage";
function AppRoutes() {
  return (
    <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />



        {/* Admin Router     */}
        <Route path="/Admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
    </Routes>
    
  );
}

export default AppRoutes;