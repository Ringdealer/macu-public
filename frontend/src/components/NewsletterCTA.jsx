import React, { useState } from "react"; // new: useState for email
import { useNavigate } from "react-router-dom"; // new: import navigation hook

function NewsletterCTA({ redirectTo = "/signup" }) { // new: accept redirect prop with fallback
  const navigate = useNavigate(); // new: initialize navigate
  const [email, setEmail] = useState(""); // new: store input email

  const handleSubscribe = () => { // new: handle button click
    if (!email) return; // new: basic guard
    navigate(redirectTo, { state: { email } }); // new: pass email to signup page
  };

  return (
    <section className="w-full bg-red-600 rounded-xl text-white px-6 py-8 mt-16">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold">
            ¡Mantente al día con nuestras ofertas!
          </h2>
          <p className="mt-2 text-sm sm:text-base">
            Suscríbete y recibe información de productos y promociones
            exclusivas.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="email"
            placeholder="Tu correo electrónico"
            aria-label="Correo electrónico para suscripción"
            value={email} // new: controlled input
            onChange={(e) => setEmail(e.target.value)} // new: update state
            className="px-4 py-2 rounded text-gray-900 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            onClick={handleSubscribe} // new: use handler
            className="bg-white text-red-600 font-bold px-6 py-2 rounded hover:bg-gray-100 transition"
          >
            Suscribirse
          </button>
        </div>
      </div>
    </section>
  );
}

export default NewsletterCTA;