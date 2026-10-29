/**
 * hooks/useAuth.js
 * Convenience re-export of useAuth from AuthContext
 * Also exports custom hooks used across the app
 */

import { useState, useCallback, useRef, useEffect } from "react";
export { useAuth } from "../context/AuthContext";

// ─── useToast ─────────────────────────────────────────────
/**
 * Provides a toast notification system.
 * Returns: { toasts, toast(msg, type), dismiss(id) }
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = "info", duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, toast, dismiss };
};

// ─── useDebounce ──────────────────────────────────────────
export const useDebounce = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

// ─── useLocalStorage ──────────────────────────────────────
export const useLocalStorage = (key, initial) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initial;
    } catch {
      return initial;
    }
  });

  const set = useCallback((v) => {
    setValue(v);
    localStorage.setItem(key, JSON.stringify(v));
  }, [key]);

  return [value, set];
};

// ─── useClickOutside ──────────────────────────────────────
export const useClickOutside = (callback) => {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) callback();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [callback]);
  return ref;
};