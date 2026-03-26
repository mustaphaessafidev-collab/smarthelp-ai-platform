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
import VerifyCodePage from "../components/auth/verify-code";
import Agent from "../page/agent";
import Page404 from "../page/page404";
import User from "../page/User";
import AgentManagement from "../page/pageAdmin/AgentManagement";
function AppRoutes() {
  return (
    <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-code" element={<VerifyCodePage />} />
        <Route path="/Agent" element={<Agent />} />
        <Route path="/page404" element={<Page404 />} />
        <Route path="/User" element={<User />} />
        <Route path="/" element={<HomePage />} />



        {/* Admin Router     */}
        <Route path="/Admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="agent" element={<AgentManagement />} />
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
    </Routes>
    
  );
}

export default AppRoutes;