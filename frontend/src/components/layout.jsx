import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout as logoutService } from "../services/authService";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { FaWhatsapp, FaFacebookF, FaEnvelope } from "react-icons/fa6";

function Layout({ children, user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  const hasHiddenOnce = useRef(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const scrollThreshold = 12;

  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart") || "[]")
  );

  // Sync cart across pages
  useEffect(() => {
    const syncCart = () => {
      setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
    };

    window.addEventListener("storage", syncCart);
    window.addEventListener("cartUpdated", syncCart);

    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("cartUpdated", syncCart);
    };
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        await logoutService(token);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");

      setCart([]);
      if (setUser) setUser(null);

      setMenuOpen(false);
      navigate("/login");
    }
  };

  // Close mobile menu outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navbar scroll effect
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
    location.pathname === path ? "text-yellow-400" : "text-blue-500";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* Navbar */}
      <nav
        className={`sticky top-0 z-50 bg-gray-900/85 backdrop-blur-sm shadow-md px-4 py-4 flex items-center justify-between relative transition-transform duration-300 ease-in-out ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Hamburguer */}
        <div className="flex items-center gap-4 relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="md:hidden text-black focus:outline-none"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <Link to="/" className="font-bold text-2xl text-white">
            MACU
          </Link>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center space-x-5">
          <Link to="/" className={`hover:text-white font-medium ${getLinkClass("/")}`}>
            Inicio
          </Link>

          <Link to="/products" className={`hover:text-white font-medium ${getLinkClass("/products")}`}>
            Productos
          </Link>

          <Link to="/about" className={`hover:text-white font-medium ${getLinkClass("/about")}`}>
            Acerca de MACU
          </Link>

          {user ? (
            <>
              <span className="text-sm text-white">Hola {user.email}!</span>

              <button
                onClick={handleLogout}
                className="text-blue-500 font-medium hover:animate-pulse transition"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`hover:text-white font-medium ${getLinkClass("/login")}`}>
                Iniciar Sesión
              </Link>

              <Link to="/signup" className={`hover:text-white font-medium ${getLinkClass("/signup")}`}>
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Cart */}
        <Link
          to="/cart"
          className="relative text-white text-2xl hover:animate-pulse"
          title="Ir al carrito"
        >
          <HiOutlineShoppingCart />

          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
              {cart.length}
            </span>
          )}
        </Link>
      </nav>

      {/* Mobile */}
       <div
        className={`md:hidden fixed top-16 left-0 w-full bg-gray-900 text-white px-4 overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 py-3" : "max-h-0"
        } z-50`}
      >
        <Link
          to="/"
          className={`block py-2 font-medium ${getLinkClass("/")} hover:text-blue-400`}
          onClick={() => setMenuOpen(false)}
        >
          Inicio
        </Link>
        <Link
          to="/products"
          className={`block py-2 font-medium ${getLinkClass("/products")} hover:text-blue-400`}
          onClick={() => setMenuOpen(false)}
        >
          Productos
        </Link>
        <Link
          to="/about"
          className={`block py-2 font-medium ${getLinkClass("/about")} hover:text-blue-400`}
          onClick={() => setMenuOpen(false)}
        >
          Acerca de MACU
        </Link>

        {user ? (
          <>
            <span className="block py-2 text-white">Hola {user.email}!</span>
            <span
  onClick={handleLogout}
  className="block py-2 text-blue-400 font-medium hover:animate-pulse cursor-pointer"
>
  Cerrar Sesión
</span>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`block py-2 font-medium ${getLinkClass("/login")} hover:text-blue-400`}
              onClick={() => setMenuOpen(false)}
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/signup"
              className={`block py-2 font-medium ${getLinkClass("/signup")} hover:text-blue-400`}
              onClick={() => setMenuOpen(false)}
            >
              Registrarse
            </Link>
          </>
        )}
      </div>

      {/* Content */}
      <main className="flex-grow container mx-auto mt-10 px-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">

          <div>
            <h3 className="font-bold text-lg mb-3">MACU</h3>
            <p className="text-sm text-gray-300">
              Movimiento Abastecimiento Confianza Unión. Importación organizada
              de productos esenciales para nuestros clientes.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3">Enlaces</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-white">Inicio</Link></li>
              <li><Link to="/products" className="hover:text-white">Productos</Link></li>
              <li><Link to="/about" className="hover:text-white">Acerca de MACU</Link></li>
              <li><Link to="/cart" className="hover:text-white">Carrito</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3">Atención al Cliente</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Correo: contacto@macu.com</li>
              <li>Pedidos personalizados disponibles</li>
              <li>Entrega según disponibilidad marítima</li>
            </ul>
          </div>

          <div className="md:text-center">
            <h3 className="font-bold text-lg mb-3">Síguenos</h3>
            <div className="flex md:justify-center gap-4 text-xl">
              <a href="#" className="hover:text-green-400 transition">
                <FaWhatsapp />
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                <FaFacebookF />
              </a>
              <a href="mailto:contacto@macu.com" className="hover:text-yellow-400 transition">
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