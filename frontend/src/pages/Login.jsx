// frontend/src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import { login as loginService, getCurrentUser } from "../services/authService";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = await loginService(email, password);

      if (data.key) {
        localStorage.setItem("token", data.key);

        try {
          const userData = await getCurrentUser(data.key);
          localStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
        } catch (err) {
          console.error("Failed to fetch user profile:", err);
          const minimalUser = {
            username: email.includes("@") ? email.split("@")[0] : email
          };
          localStorage.setItem("user", JSON.stringify(minimalUser));
          setUser(minimalUser);
        }

        setSuccess("Login successful!");
        setTimeout(() => navigate("/products"), 500);
      } else {
        setError(
          data.non_field_errors
            ? data.non_field_errors.join(" ")
            : JSON.stringify(data)
        );
      }

    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950 transition-colors">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-900 shadow-lg rounded-xl p-8 space-y-5 border border-gray-200 dark:border-gray-800 transition-colors"
      >
        <h1 className="text-2xl font-bold text-center text-blue-700 dark:text-blue-400">
          Iniciar Sesión
        </h1>

        {location.state?.message && (
          <p className="text-green-600 dark:text-green-400 text-sm text-center">
            {location.state.message}
          </p>
        )}

        {/* EMAIL / USERNAME */}
        <input
          type="text"
          placeholder="Email o Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        {/* PASSWORD */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300 cursor-pointer"
          >
            {showPassword ? <HiEyeOff /> : <HiEye />}
          </span>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-md w-full hover:bg-blue-700 dark:hover:bg-blue-500 transition duration-200 font-medium"
        >
          Login
        </button>

        {/* ERROR / SUCCESS */}
        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm text-center">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-600 dark:text-green-400 text-sm text-center">
            {success}
          </p>
        )}
      </form>
    </div>
  );
}