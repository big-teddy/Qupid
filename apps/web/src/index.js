import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}
const root = ReactDOM.createRoot(rootElement);
root.render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));
// Service Worker Registration
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
            console.log("[SW] Service Worker registered:", registration.scope);
        })
            .catch((error) => {
            console.error("[SW] Service Worker registration failed:", error);
        });
    });
}
