// frontend/src/pages/Signup.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../services/config";
import { HiEye, HiEyeOff, HiExclamationCircle } from "react-icons/hi";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const [phoneCountryCode, setPhoneCountryCode] = useState("+53");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE}/en/api/auth/registration/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username,
          password1,
          password2,
          phone_number: `${phoneCountryCode}${phoneNumber}`,
          address: address,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("¡Registro exitoso! Redirigiendo al login...");
        setTimeout(() => {
          navigate("/login", {
            state: { message: "Cuenta creada correctamente. Inicia sesión." },
          });
        }, 1500);
      } else {
        const fieldErrors = {};

        if (data.non_field_errors)
          fieldErrors.general = "Error de registro. Verifica los datos.";

        if (data.username)
          fieldErrors.username = data.username.join(" ");

        if (data.password1)
          fieldErrors.password1 = data.password1.join(" ");

        if (data.password2)
          fieldErrors.password2 = data.password2.join(" ");

        if (data.phone_number)
          fieldErrors.phone_number = data.phone_number.join(" ");

        setErrors(fieldErrors);
      }
    } catch (err) {
      console.error(err);
      setErrors({ general: "Error del servidor. Intenta más tarde." });
    }
  };

  const renderPasswordInput = (
    label,
    value,
    setValue,
    showPassword,
    setShowPassword,
    error
  ) => (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`border p-3 rounded-md w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${
          error
            ? "focus:ring-red-500 border-red-500 dark:border-red-500"
            : "focus:ring-blue-500 border-gray-300 dark:border-gray-700"
        }`}
        required
      />

      <span
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300 cursor-pointer"
      >
        {showPassword ? <HiEyeOff /> : <HiEye />}
      </span>

      {error && (
        <p className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm mt-1">
          <HiExclamationCircle /> {error}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950 transition-colors">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-900 shadow-lg rounded-xl p-8 space-y-5 border border-gray-200 dark:border-gray-800 transition-colors"
      >
        <h1 className="text-2xl font-bold text-center text-blue-700 dark:text-blue-400">
          Registrarse
        </h1>

        {errors.general && (
          <div className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 px-4 py-2 rounded mb-4 flex items-center gap-2">
            <HiExclamationCircle /> {errors.general}
          </div>
        )}

        {/* Username */}
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`border p-3 rounded-md w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${
            errors.username
              ? "focus:ring-red-500 border-red-500 dark:border-red-500"
              : "focus:ring-blue-500 border-gray-300 dark:border-gray-700"
          }`}
          required
        />

        {errors.username && (
          <p className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm mt-1">
            <HiExclamationCircle /> {errors.username}
          </p>
        )}

        {/* Passwords */}
        {renderPasswordInput(
          "Contraseña",
          password1,
          setPassword1,
          showPassword1,
          setShowPassword1,
          errors.password1
        )}

        {renderPasswordInput(
          "Confirmar Contraseña",
          password2,
          setPassword2,
          showPassword2,
          setShowPassword2,
          errors.password2
        )}

        {/* Phone */}
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Teléfono
          </label>

          <div className="flex gap-2">
            <select
              value={phoneCountryCode}
              onChange={(e) => setPhoneCountryCode(e.target.value)}
              className="border p-3 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="+53">🇨🇺 +53</option>
              <option value="+52">🇲🇽 +52</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+1242">🇧🇸 +1 242</option>
              <option value="+34">🇪🇸 +34</option>
              <option value="+57">🇨🇴 +57</option>
            </select>

            <input
              type="text"
              placeholder="Número"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border p-3 rounded-md w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {errors.phone_number && (
            <p className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm mt-1">
              <HiExclamationCircle /> {errors.phone_number}
            </p>
          )}
        </div>

        {/* Address */}
        <input
          type="text"
          placeholder="Dirección (opcional)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border p-3 rounded-md w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-md w-full hover:bg-blue-700 dark:hover:bg-blue-500 transition duration-200 font-medium"
        >
          Registrarse
        </button>

        {success && (
          <p className="text-green-600 dark:text-green-400 text-sm text-center">
            {success}
          </p>
        )}
      </form>
    </div>
  );
}