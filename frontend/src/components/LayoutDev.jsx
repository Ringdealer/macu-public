// frontend/src/components/LayoutDev.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout as logoutService } from "../services/authService";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { FaWhatsapp, FaFacebookF, FaEnvelope } from "react-icons/fa6";
import useCart from "../hooks/useCart";
import { CONTACT_INFO } from "../services/config"; 
import ProfileMenu from "./ProfileMenu"; 
import HamburgerIcon from "./icons/HamburgerIcon"; // new

function Layout({ children, user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  const hasHiddenOnce = useRef(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const scrollThreshold = 12;

// ================= DARK MODE STATE =================
  const [darkMode, setDarkMode] = useState(() => { 
    return localStorage.getItem("theme") === "dark"; 
  });

  useEffect(() => { 
    const root = window.document.documentElement;

    if (darkMode) {
      root.classList.add("dark"); 
      localStorage.setItem("theme", "dark"); 
    } else {
      root.classList.remove("dark"); 
      localStorage.setItem("theme", "light"); 
    }
  }, [darkMode]);

 
  // ===================================================



  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart") || "[]"),
  );

  useEffect(() => {
    const syncCart = () =>
      setCart(JSON.parse(localStorage.getItem("cart") || "[]"));

    window.addEventListener("storage", syncCart);
    window.addEventListener("cartUpdated", syncCart);

    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("cartUpdated", syncCart);
    };
  }, []);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (Math.abs(delta) < scrollThreshold) return;

      if (currentScrollY < 50) hasHiddenOnce.current = false;

      if (delta > 0 && currentScrollY > 80 && !hasHiddenOnce.current) {
        setShowNavbar(false);
        hasHiddenOnce.current = true;
        setTimeout(() => setShowNavbar(true), 300);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getLinkClass = (path) =>
    location.pathname === path
      ? "text-blue-700 border-b-2 border-blue-700 pb-1"
      : "text-gray-600 hover:text-blue-700";

  return (
   <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">

      {/* ================= NAVBAR ================= */}
      <nav
        className={`sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-md transition-transform duration-300 ease-in-out ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`} 
      >
        {/* ===== Top trust bar ===== */}
        <div className="bg-blue-700 text-white text-xs sm:text-sm px-4 py-2 flex justify-between items-center"> {/* unchanged */}
          <span className="font-medium">
            Compra en España y recibe en Cuba
          </span>

          <div className="hidden sm:flex items-center gap-4">
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-90 transition"
            >
              <FaWhatsapp className="text-green-300" />
              <span>{CONTACT_INFO.whatsapp}</span>
            </a>
          </div>
        </div>

        {/* Main navbar */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 relative" ref={menuRef}>
        {/* frontend/src/components/LayoutDev.jsx */}

<div
  onClick={(e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  }}
  className="w-10 h-10 bg-blue-700 text-white rounded-lg flex items-center justify-center cursor-pointer"
>
  ☰
</div>

            <Link
              to="/"
              className="text-2xl font-bold text-blue-700 tracking-tight"
            >
              MACU
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`font-medium ${getLinkClass("/")}`}>
              Inicio
            </Link>
            <Link
              to="/products"
              className={`font-medium ${getLinkClass("/products")}`}
            >
              Productos
            </Link>
            <Link
              to="/about"
              className={`font-medium ${getLinkClass("/about")}`}
            >
              Acerca de MACU
            </Link>

            {user && (
              <Link
                to="/orders"
                className={`font-medium ${getLinkClass("/orders")}`}
              >
                Mis Pedidos
              </Link>
            )}

            {user ? null : (
              <>
                <Link
                  to="/login"
                  className={`font-medium ${getLinkClass("/login")}`}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/signup"
                  className={`font-medium ${getLinkClass("/signup")}`}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

           {/* ===== Cart + Profile + Dark Mode ===== */}
          <div className="flex items-center gap-3"> {/* unchanged */}

            {/* Dark Mode Toggle */}
           {/* Dark Mode Toggle (Animated SVG) */}
<button
  onClick={() => setDarkMode(!darkMode)}
  className="group relative w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 
             hover:bg-slate-300 dark:hover:bg-slate-700 
             transition-all duration-300 flex items-center justify-center"
>
  {/* Glow effect */}
  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 
                  transition duration-300 blur-md 
                  bg-yellow-300/30 dark:bg-blue-400/20" />

  {/* ICON CONTAINER */}
  <div className="relative transition-transform duration-500 ease-in-out 
                  group-hover:scale-110 group-hover:rotate-12">

    {/* SUN */}
    <svg
      className={`w-5 h-5 absolute inset-0 transition-all duration-500 
        ${darkMode ? "opacity-100 rotate-0 scale-100 text-yellow-400" 
                   : "opacity-0 rotate-90 scale-50"}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.2" y1="4.2" x2="6.3" y2="6.3" />
      <line x1="17.7" y1="17.7" x2="19.8" y2="19.8" />
      <line x1="4.2" y1="19.8" x2="6.3" y2="17.7" />
      <line x1="17.7" y1="6.3" x2="19.8" y2="4.2" />
    </svg>

    {/* MOON */}
    <svg
      className={`w-5 h-5 transition-all duration-500 
        ${darkMode ? "opacity-0 -rotate-90 scale-50" 
                   : "opacity-100 rotate-0 scale-100 text-slate-700 dark:text-slate-200"}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
    </svg>

  </div>
</button>

            {user && <ProfileMenu user={user} setUser={setUser} />}

            <Link
              to="/cart"
              className="relative bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-800 transition"
            >
              <HiOutlineShoppingCart className="text-xl" />
              <span className="hidden sm:inline">Carrito</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
      {/* Mobile menu */}
      {/* Overlay */} {/* new */}
{menuOpen && (
  <div
    className="fixed inset-0 bg-black/40 z-40"
    onClick={() => setMenuOpen(false)}
  />
)}

{/* Mobile menu */} {/* new */}
<div
  ref={menuRef}
  className={`md:hidden fixed top-0 left-0 h-full w-72 bg-slate-900 dark:bg-slate-900 text-slate-100 px-4 py-6 z-50
  transform transition-transform duration-300 ease-in-out ${
    menuOpen ? "translate-x-0" : "-translate-x-full"
  }`}
>
        {[
          { path: "/", label: "Inicio" },
          { path: "/products", label: "Productos" },
          { path: "/about", label: "Acerca de MACU" },
          ...(user ? [{ path: "/orders", label: "Mis Pedidos" }] : []),
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMenuOpen(false)}
            className={`block py-2 font-medium ${
              location.pathname === item.path
                ? "text-yellow-500"
                : "text-blue-400 hover:text-blue-300"
            }`}
          >
            {item.label}
          </Link>
        ))}

        <div className="border-t mt-3 pt-3">
          {user ? (
            <>
              <p className="text-blue-700 font-semibold">{user.username}</p>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  localStorage.removeItem("cart");
                  setUser(null);
                  navigate("/login");
                  setMenuOpen(false);
                }}
                className="block mt-2 text-blue-600 hover:text-blue-800"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-blue-600 hover:text-blue-800"
              >
                Iniciar Sesión
              </Link>

              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-blue-600 hover:text-blue-800"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
      {/* Content */}
      <main className="flex-grow container mx-auto mt-10 px-4">

        
        {children}</main>
      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center gap-2 z-50 animate-pulse"
      >
        <FaWhatsapp className="text-2xl" />
        <span className="hidden sm:block text-sm font-medium">Escríbenos</span>
      </a>
      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3">MACU</h3>
            <p className="text-sm text-gray-300">
              Movimiento Abastecimiento Confianza Unión.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3">Enlaces</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/">Inicio</Link>
              </li>
              <li>
                <Link to="/products">Productos</Link>
              </li>
              <li>
                <Link to="/about">Acerca de MACU</Link>
              </li>
              <li>
                <Link to="/cart">Carrito</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3">Atención al Cliente</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Correo: {CONTACT_INFO.email}</li>
            </ul>
          </div>

          <div className="md:text-center">
            <h3 className="font-bold text-lg mb-3">Síguenos</h3>
            <div className="flex md:justify-center gap-4 text-xl">
              <a href={`https://wa.me/${CONTACT_INFO.whatsapp}`}>
                <FaWhatsapp />
              </a>
              <a href={`https://facebook.com/${CONTACT_INFO.facebook}`}>
                <FaFacebookF />
              </a>
              <a href={`mailto:${CONTACT_INFO.email}`}>
                <FaEnvelope />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 text-center text-sm text-gray-400 py-4">
          &copy; 2026 MACU Import Business. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}

export default Layout;
