/**
 * AuthContext.jsx
 * Global authentication state management
 * Stores JWT in localStorage, exposes user + auth methods
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI, userAPI } from "../api/api";

// ─── Context Creation ──────────────────────────────────────
const AuthContext = createContext(null);

// ─── Mock User (for UI demo when backend is offline) ──────
const MOCK_USER = {
  id: "usr_001",
  name: "Arjun Sharma",
  email: "arjun@skillbridge.io",
  role: "Full-Stack Developer",
  bio: "Building the web, one component at a time. React enthusiast & open-source contributor.",
  location: "Bengaluru, India",
  avatar: null,
  skillsTeach: ["React", "Node.js", "TypeScript", "GraphQL"],
  skillsLearn: ["Machine Learning", "Figma", "Rust"],
  rating: 4.8,
  sessions: 24,
  learners: 87,
  joined: "January 2024",
};

// ─── Provider ─────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // On mount: restore session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("skillbridge_token");
    const savedUser  = localStorage.getItem("skillbridge_user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("skillbridge_token");
        localStorage.removeItem("skillbridge_user");
      }
    }
    setLoading(false);
  }, []);

  // ── Login ────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      const jwt = res.data.accessToken;
      
      // Save token temporarily so subsequent requests are authenticated
      localStorage.setItem("skillbridge_token", jwt);
      
      // Fetch associated user profile
      const profileRes = await userAPI.getProfile();
      const userData = profileRes.data;

      _persistSession(jwt, userData);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Register ─────────────────────────────────────────────
  const register = useCallback(async (formData) => {
    setError(null);
    setLoading(true);
    try {
      // Backend expects string for skills, fallback if not provided
      await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        skillsLearn: formData.skillsLearn || "React",
        skillsTeach: formData.skillsTeach || "HTML",
        bio: formData.bio || "Enthusiastic learner joining SkillBridge!"
      });
      // Automatically login after successful registration
      return await login(formData.email, formData.password);
    } catch (err) {
      const msg = err.response?.data || err.response?.data?.message || err.message;
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, [login]);

  // ── Logout ───────────────────────────────────────────────
  const logout = useCallback(() => {
    try { authAPI.logout(); } catch {}
    setUser(null);
    setToken(null);
    localStorage.removeItem("skillbridge_token");
    localStorage.removeItem("skillbridge_user");
  }, []);

  // ── Update profile in backend & local state ──────────────
  const updateUser = useCallback(async (data) => {
    setError(null);
    try {
      const res = await userAPI.updateProfile(data);
      const updatedData = res.data;
      
      setUser(updatedData);
      localStorage.setItem("skillbridge_user", JSON.stringify(updatedData));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      return { success: false, message: msg };
    }
  }, []);

  // ── Internal: persist session ────────────────────────────
  const _persistSession = (jwt, userData) => {
    setToken(jwt);
    setUser(userData);
    localStorage.setItem("skillbridge_token", jwt);
    localStorage.setItem("skillbridge_user", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      error,
      isAuthenticated: !!user,
      isAdmin: user?.role === "ADMIN",
      login,
      register,
      logout,
      updateUser,
      setError,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook Export ──────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;
