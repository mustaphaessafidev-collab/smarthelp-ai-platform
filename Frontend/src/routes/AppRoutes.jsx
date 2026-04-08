import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "../components/layout/layoutAdmin/AdminLayout";
import Dashboard from "../page/pageAdmin/Dashboard";
import UserManagement from "../page/pageAdmin/UserManagement";
import KnowledgeBase from "../page/pageAdmin/KnowledgeBase";
import Analytics from "../page/pageAdmin/Analytics";
import Settings from "../page/pageAdmin/Settings";
import AdminProfile from "../page/pageAdmin/AdminProfile";
import LoginPage from "../components/auth/LoginPage";
import RegisterPage from "../components/auth/RegisterPage";
import HomePage from "../components/home/HomePage";
import VerifyCodePage from "../components/auth/verify-code";
import Categories from "../page/pageAdmin/Categories";

import Page404 from "../page/page404";

import AgentManagement from "../page/pageAdmin/AgentManagement";
import UserDashboard from "../page/pageClient/Dashboard";
import MyTickets from "../page/pageClient/MyTickets";
import CreateTicket from "../page/pageClient/CreateTicket";
import UserLayout from "../components/layout/layoutClient/UserLayout";
import UserProfile from "../page/pageClient/UserProfile";
import AgentLayout from "../components/layout/layoutAgent/AgentLayout";
import AgentDashboard from "../page/pageAgent/AgentDashboard";
import AgentTickets from "../page/pageAgent/AgentTickets";
import AgentProfile from "../page/pageAgent/AgentProfile";
import AllTickets from "../page/pageAgent/AllTickets";
import TicketDetails from "../page/pageClient/ticketDetails";
import UpdateTicket from "../page/pageClient/updateTicket";

function AppRoutes() {
  return (
    <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-code" element={<VerifyCodePage />} />
        
        <Route path="/" element={<HomePage />} />
        



        {/* Admin Router     */}
        <Route path="/Admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="agent" element={<AgentManagement />} />
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="Profile" element={<AdminProfile />} />
          <Route path="Categories" element={<Categories />} />
          {/* <Route path="*" element={<ErrorPage />} /> */}
        </Route>

        {/* User Router     */}
        <Route path="/User" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="MyTickets" element={<MyTickets />} />
          <Route path="CreateTicket" element={<CreateTicket />} />
          <Route path="TicketDetails/:id" element={<TicketDetails/>}/>
          <Route path="UpdateTicket/:id" element={<UpdateTicket />} />
          <Route path="Profile" element={<UserProfile />} />
          {/* <Route path="/" element={<ErrorPage />} /> */}
          
        </Route>
        {/* Agent Router     */}
        <Route path="/Agent" element={<AgentLayout />}>
          <Route index element={<AgentDashboard />} />
          <Route path="Tickets" element={<AgentTickets />} />
          <Route path="Profile" element={<AgentProfile />} />
          <Route path="AllTickets" element={<AllTickets />} />  
          {/* <Route path="*" element={<ErrorPage />} />         */}
        </Route>

        
    </Routes>
    
  );
}

export default AppRoutes;