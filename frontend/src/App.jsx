// frontend/src/App.jsx

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// import Home from "./pages/Home";
import Home from "./pages/HomeDev";
import About from "./pages/About";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile"; // new
import { getCurrentUser } from "./services/authService";

// Orders pages import
import OrderList from "./components/orders/OrderList";
import OrderDetail from "./components/orders/OrderDetail";
import OrderForm from "./components/orders/OrderForm";

// Cart page import
import Cart from "./pages/Cart";

// Layout import
import Layout from "./components/LayoutDev";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto", // instant reset for route changes
    });
  }, [pathname]);

  return null;
}

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        return;
      }

      try {
        const data = await getCurrentUser(token);

        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (err) {
        console.error("Session invalid:", err);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <Router>
      <ScrollToTop />

      <Layout user={user} setUser={setUser}>
        {/* Ensure full width on mobile */}
        <main className="flex-grow w-full px-4 sm:max-w-5xl sm:mx-auto mt-10">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/about" element={<About user={user} />} />

            <Route path="/signup" element={<Signup setUser={setUser} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/profile" element={<Profile user={user} />} /> 

            <Route path="/products" element={<Products user={user} />} />

            {/* Orders routes */}
            <Route path="/orders" element={<OrderList user={user} />} />
            <Route path="/orders/new" element={<OrderForm user={user} />} />
            <Route path="/orders/:id" element={<OrderDetail user={user} />} />

            <Route path="/products/:id" element={<ProductDetail />} />

            {/* Cart route */}
            <Route path="/cart" element={<Cart user={user} />} />

            <Route path="*" element={<Home user={user} />} />
          </Routes>
        </main>
      </Layout>
    </Router>
  );
}

export default App;