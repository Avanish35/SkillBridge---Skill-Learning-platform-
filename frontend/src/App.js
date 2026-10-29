/**
 * App.js
 * Root application — routing, layout shell, toast notifications.
 */

import React, { useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./routes/ProtectedRoute";

// ── Pages ──────────────────────────────────────────────────
import LoginPage    from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard    from "./pages/Dashboard";
import Profile      from "./pages/Profile";
import Skills       from "./pages/Skills";
import Matches      from "./pages/Matches";
import Chat         from "./pages/Chat";
import Schedule     from "./pages/Schedule";
import About        from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import PlatformActivity from "./pages/PlatformActivity";
import Network          from "./pages/Network";

// ── Components ─────────────────────────────────────────────
import Navbar  from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Chatbot from "./components/Chatbot/Chatbot";

// ── Styles ─────────────────────────────────────────────────
import "./styles/theme.css";
import "./styles/global.css";

// ─── Toast System ─────────────────────────────────────────
const TOAST_ICONS = { success:"✅", error:"❌", info:"ℹ️", warning:"⚠️" };

const ToastContainer = ({ toasts }) => (
  <div className="toast-container">
    {toasts.map(t => (
      <div key={t.id} className={`toast-item toast-${t.type}`}>
        <span className="flex-shrink-0">{TOAST_ICONS[t.type] || "ℹ️"}</span>
        <span>{t.message}</span>
      </div>
    ))}
  </div>
);

// ─── App Shell (authenticated layout) ─────────────────────
const AppShell = ({ toast }) => {
  const { isAuthenticated }   = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Auth pages use full-screen layout (no navbar/sidebar)
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login"    element={<LoginPage    toast={toast} />} />
        <Route path="/register" element={<RegisterPage toast={toast} />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Top navbar */}
      <Navbar
        onMenuToggle={() => setSidebarOpen(o => !o)}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex" style={{ paddingTop: "var(--navbar-height)" }}>
        {/* Left sidebar (authenticated only) */}
        {isAuthenticated && (
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        <main
          className="flex-1 min-w-0 transition-all duration-300 relative"
          style={{
            marginLeft: (isAuthenticated && sidebarOpen) ? "var(--sidebar-width)" : "0",
          }}
        >
          {/* Layout Configuration */}
          <style>{`
            @media(max-width:1023px){
              main { margin-left: 0 !important; }
            }
            .sidebar-push { transition: margin-left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
            .canvas-container {
              width: 100%;
              max-width: 1800px;
              margin: 0 auto;
              padding: 0; /* Truly edge-to-edge */
            }
          `}</style>

          <div className="canvas-container">
            <Routes>
              {/* Public */}
              <Route path="/login"    element={<LoginPage    toast={toast} />} />
              <Route path="/register" element={<RegisterPage toast={toast} />} />

              {/* Protected */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard toast={toast} /></ProtectedRoute>} />
              <Route path="/profile"   element={<ProtectedRoute><Profile   toast={toast} /></ProtectedRoute>} />
              <Route path="/skills"    element={<ProtectedRoute><Skills    toast={toast} /></ProtectedRoute>} />
              <Route path="/matches"   element={<ProtectedRoute><Matches   toast={toast} /></ProtectedRoute>} />
              <Route path="/chat"      element={<ProtectedRoute><Chat      toast={toast} /></ProtectedRoute>} />
              <Route path="/network"   element={<ProtectedRoute><Network   toast={toast} /></ProtectedRoute>} />
              <Route path="/schedule"  element={<ProtectedRoute><Schedule  toast={toast} /></ProtectedRoute>} />
              <Route path="/about"     element={<ProtectedRoute><About     toast={toast} /></ProtectedRoute>} />
              <Route path="/activity"  element={<ProtectedRoute><PlatformActivity toast={toast} /></ProtectedRoute>} />
              <Route path="/admin"     element={<ProtectedRoute><AdminDashboard toast={toast} /></ProtectedRoute>} />

              {/* Default redirects */}
              <Route path="/"  element={<Navigate to="/dashboard" replace />} />
              <Route path="*"  element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

// ─── Root App ─────────────────────────────────────────────
const App = () => {
  const [toasts, setToasts] = useState([]);

  // Global toast function passed down to pages
  const toast = useCallback((message, type = "info", duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppShell toast={toast} />
          <ToastContainer toasts={toasts} />
          <Chatbot />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;