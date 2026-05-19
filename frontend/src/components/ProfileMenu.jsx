// frontend/src/components/ProfileMenu.jsx

import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaSignOutAlt, FaTrash, FaUser } from "react-icons/fa";
import {
  logout as logoutService,
  deleteAccount,
} from "../services/authService";

export default function ProfileMenu({ user, setUser }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      if (token) await logoutService(token);
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");

      setUser(null);
      setOpen(false);

      navigate("/login");
    }
  };

  const handleDeleteAccount = async () => {
    const confirm1 = window.confirm(
      "⚠️ Esta acción eliminará tu cuenta permanentemente."
    );
    if (!confirm1) return;

    const confirm2 = window.confirm(
      "¿Estás completamente seguro? Esta acción NO se puede deshacer."
    );
    if (!confirm2) return;

    const token = localStorage.getItem("token");

    try {
      if (token) await deleteAccount(token);

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");

      setUser(null);
      setOpen(false);

      alert("Tu cuenta ha sido eliminada.");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la cuenta.");
    }
  };

  const initial = user?.username?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md hover:scale-105 transition"
      >
        {initial}
      </button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 mt-3 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden transform transition-all duration-200 origin-top-right ${
          open
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        {/* User header */}
        <div className="px-4 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
              {initial}
            </div>

            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                {user?.username}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="py-1">
          {/* Profile */}
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <FaUser className="text-gray-500 dark:text-gray-300" />
            <span>Mi perfil</span>
          </Link>

          {/* Logout */}
<button
  onClick={handleLogout}
  className="w-full flex items-center gap-2 px-4 py-2 text-sm 
             text-gray-700 dark:text-gray-200 
             bg-white dark:bg-gray-900 
             hover:bg-gray-100 dark:hover:bg-gray-800 
             transition"
>
  <FaSignOutAlt className="text-gray-500 dark:text-gray-300" />
  <span>Cerrar sesión</span>
</button>

{/* Delete account */}
<button
  onClick={handleDeleteAccount}
  className="w-full flex items-center gap-2 px-4 py-2 text-sm 
             text-red-600 dark:text-red-400 
             bg-white dark:bg-gray-900 
             hover:bg-red-50 dark:hover:bg-red-950 
             transition"
>
  <FaTrash />
  <span>Eliminar cuenta</span>
</button>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 text-[11px] text-gray-400 dark:text-gray-500 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
          Gestión de cuenta MACU
        </div>
      </div>
    </div>
  );
}