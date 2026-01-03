import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { BottomNavBar } from "../components/BottomNavBar";

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.startsWith("/home")) return "HOME";
    if (path.startsWith("/chat")) return "CHAT_TAB";
    if (path.startsWith("/coaching")) return "COACHING_TAB";
    if (path === "/my" || path.startsWith("/my/")) return "MY_TAB";
    return "HOME";
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tab: any) => {
    switch (tab) {
      case "HOME":
        navigate("/home");
        break;
      case "CHAT_TAB":
        navigate("/chat");
        break;
      case "COACHING_TAB":
        navigate("/coaching");
        break;
      case "MY_TAB":
        navigate("/my");
        break;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-white">
      <div className="flex-1 overflow-hidden relative">
        <Outlet />
      </div>
      <BottomNavBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};
