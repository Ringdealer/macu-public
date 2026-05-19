// frontend/src/pages/Profile.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../services/config";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [phoneCountryCode, setPhoneCountryCode] = useState("+53");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [form, setForm] = useState({
    email: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ---------------- LOAD PROFILE ----------------
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`${API_BASE}/en/api/v1/profile/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const data = await res.json();
        setUser(data);

        const fullPhone = data.phone_number || "";

        let countryCode = "+53";
        let number = fullPhone;

        if (fullPhone.startsWith("+")) {
          const knownCodes = ["+1242", "+1", "+34", "+52", "+53", "+57"];

          const detected = knownCodes.find((code) =>
            fullPhone.startsWith(code)
          );

          if (detected) {
            countryCode = detected;
            number = fullPhone.slice(detected.length);
          } else {
            const match = fullPhone.match(/^(\+\d{1,4})(.+)$/);
            if (match) {
              countryCode = match[1];
              number = match[2];
            }
          }
        }

        setPhoneCountryCode(countryCode);
        setPhoneNumber(number);

        setForm({
          email: data.email || "",
          address: data.address || "",
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    const token = localStorage.getItem("token");

    const fullPhoneNumber =
      phoneNumber.trim() !== ""
        ? `${phoneCountryCode}${phoneNumber.trim()}`
        : "";

    try {
      const res = await fetch(`${API_BASE}/en/api/v1/profile/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          email: form.email,
          address: form.address,
          phone_number: fullPhoneNumber,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        setMessage("Perfil actualizado correctamente");
      } else {
        setMessage("Error al actualizar perfil");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error del servidor");
    }

    setSaving(false);
  };

  if (loading)
    return (
      <p className="p-6 text-gray-700 dark:text-gray-300">
        Cargando perfil...
      </p>
    );

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 
                    bg-white dark:bg-gray-900 
                    shadow rounded-lg 
                    border border-gray-200 dark:border-gray-800">

      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-bold mb-6 
                     text-blue-700 dark:text-blue-400">
        Mi Perfil
      </h1>

      {/* USERNAME */}
      <div className="mb-4">
        <label className="text-sm text-gray-600 dark:text-gray-400">
          Usuario
        </label>
        <input
          value={user.username}
          disabled
          className="w-full p-2 rounded 
                     bg-gray-100 dark:bg-gray-800 
                     text-gray-700 dark:text-gray-200"
        />
      </div>

      {/* EMAIL */}
      <div className="mb-4">
        <label className="text-sm text-gray-600 dark:text-gray-400">
          Email
        </label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded 
                     bg-white dark:bg-gray-800 
                     text-gray-900 dark:text-gray-100 
                     border-gray-300 dark:border-gray-700"
        />
      </div>

      {/* PHONE */}
      <div className="mb-4">
        <label className="text-sm text-gray-600 dark:text-gray-400">
          Teléfono
        </label>

        <div className="flex gap-2">
          <select
            value={phoneCountryCode}
            onChange={(e) => setPhoneCountryCode(e.target.value)}
            className="border p-2 rounded 
                       bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-gray-100 
                       border-gray-300 dark:border-gray-700"
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
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full border p-2 rounded 
                       bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-gray-100 
                       border-gray-300 dark:border-gray-700"
          />
        </div>
      </div>

      {/* ADDRESS */}
      <div className="mb-4">
        <label className="text-sm text-gray-600 dark:text-gray-400">
          Dirección
        </label>
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          className="w-full border p-2 rounded 
                     bg-white dark:bg-gray-800 
                     text-gray-900 dark:text-gray-100 
                     border-gray-300 dark:border-gray-700"
        />
      </div>

      {/* SAVE BUTTON */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded 
                   hover:bg-blue-700 transition"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>

      {message && (
        <p className="mt-3 text-sm text-green-600 dark:text-green-400">
          {message}
        </p>
      )}
    </div>
  );
}