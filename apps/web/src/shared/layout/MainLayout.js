import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { BottomNavBar } from "../components/BottomNavBar";
export const MainLayout = () => {
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
  const handleTabChange = (tab) => {
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
  return _jsxs("div", {
    className: "flex flex-col h-screen w-full max-w-md mx-auto bg-white",
    children: [
      _jsx("div", {
        className: "flex-1 overflow-hidden relative",
        children: _jsx(Outlet, {}),
      }),
      _jsx(BottomNavBar, {
        activeTab: activeTab,
        onTabChange: handleTabChange,
      }),
    ],
  });
};
