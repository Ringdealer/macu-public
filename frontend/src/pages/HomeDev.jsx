// frontend/src/pages/HomeDev.jsx
import React, { Suspense } from "react";
// Lazy-load FeaturedProducts component
const FeaturedProducts = React.lazy(
  () => import("../components/FeaturedProducts"),
); // LAZY-LOAD UPDATE
const NewsletterCTA = React.lazy(() => import("../components/NewsletterCTA")); // LAZY-LOAD UPDATE

function Home() {
  return (
    <div className="flex flex-col items-center space-y-10">
      {/* Hero section */}
      <section className="relative w-full max-w-6xl rounded-xl overflow-hidden shadow-lg group">
        <img
  src="/images/buque-1537.webp"
  srcSet="/images/buque-375.webp 375w, /images/buque-768.webp 768w, /images/buque-1537.webp 1537w"
  sizes="(max-width: 375px) 100vw,
        (max-width: 768px) 768px, 
        (max-width: 1537px) 1537px"
  alt="Buque"
  loading="eager"
  decoding="async"
  fetchPriority="high"
  className="
    w-full 
    min-h-[320px] sm:min-h-[420px] md:min-h-[500px] 
    object-cover 
    scale-110 
    group-hover:scale-105 
    transition-transform duration-700
    will-change-transform
  "
/>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center sm:items-center items-start pt-10 sm:pt-0">
          <div className="px-6 sm:px-12 max-w-2xl w-full">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight break-words animate-fadeInUp">
              Tus compras en España
            </h1>

            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mt-2 break-words animate-fadeInUp delay-150">
              Entregadas en Cuba
            </h2>

            <p className="mt-4 text-xs sm:text-sm md:text-lg text-white/90 leading-relaxed max-w-xl animate-fadeInUp delay-300">
              Movimiento Abastecimiento Confianza Unión: importamos productos
              esenciales para nuestros clientes con seguridad y organización.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full max-w-md animate-fadeInUp delay-500">
              <a
                href="/products"
                aria-label="Ir a productos"
               className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-3 rounded-lg font-medium text-center transition whitespace-nowrap"
              >
                Ver Productos
              </a>

              <a
                href="/about"
                aria-label="Conocer más sobre MACU"
                className="bg-white/90 hover:bg-white text-blue-700 px-4 sm:px-6 py-3 rounded-lg font-medium text-center transition whitespace-nowrap"
              >
                Acerca de MACU
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
<section className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-lg border border-gray-200 dark:border-gray-700 px-4 py-5"> {/* new */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
    
    <div className="flex flex-col items-center gap-2">
      <span className="text-3xl">🚢</span>
      <h2 className="font-semibold text-blue-700 dark:text-blue-400 text-lg"> {/* new */}
        Envíos Organizados
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-300"> {/* new */}
        Consolidamos pedidos para transporte marítimo seguro.
      </p>
    </div>

    <div className="flex flex-col items-center gap-2">
      <span className="text-3xl">📦</span>
      <h2 className="font-semibold text-blue-700 dark:text-blue-400 text-lg"> {/* new */}
        Productos Seleccionados
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-300"> {/* new */}
        Productos esenciales elegidos según necesidad real.
      </p>
    </div>

    <div className="flex flex-col items-center gap-2">
      <span className="text-3xl">🔒</span>
      <h2 className="font-semibold text-blue-700 dark:text-blue-400 text-lg"> {/* new */}
        Pedidos Confiables
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-300"> {/* new */}
        Seguimiento claro y comunicación directa.
      </p>
    </div>

  </div>
</section>

{/* Business feature cards */}
<section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
  
  <div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition"> {/* new */}
    <h2 className="font-bold text-xl text-blue-700 dark:text-blue-400 mb-3"> {/* new */}
      Compra por Encargo
    </h2>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm"> {/* new */}
      Gestionamos productos solicitados por nuestros clientes y
      consolidamos pedidos de forma organizada.
    </p>
  </div>

  <div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition"> {/* new */}
    <h2 className="font-bold text-xl text-blue-700 dark:text-blue-400 mb-3"> {/* new */}
      Importación Planificada
    </h2>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm"> {/* new */}
      Coordinamos compras en origen y transporte marítimo con control de
      cada pedido.
    </p>
  </div>

  <div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition"> {/* new */}
    <h2 className="font-bold text-xl text-blue-700 dark:text-blue-400 mb-3"> {/* new */}
      Atención Directa
    </h2>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm"> {/* new */}
      Comunicación cercana para resolver necesidades específicas
      rápidamente.
    </p>
  </div>

</section>

{/* Featured Products */}
<section id="featured-products" className="py-12 bg-gray-50 dark:bg-gray-900"> {/* new */}
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-700 dark:text-blue-400 mb-10"> {/* new */}
      Productos Destacados
    </h2>
    <Suspense fallback={<div>Loading products...</div>}>
      <FeaturedProducts /> {/* LAZY-LOAD UPDATE */}
    </Suspense>
  </div>
</section>

      {/* Why Choose Us Section */}
      <section className="w-full mt-16 bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl text-white px-6 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <span className="text-4xl">🚀</span>
            <h2 className="font-bold text-xl">Entrega Rápida</h2>
            <p className="text-sm sm:text-base">
              Garantizamos que tus pedidos lleguen a tiempo.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <span className="text-4xl">💳</span>
            <h2 className="font-bold text-xl">Pagos Seguros</h2>
            <p className="text-sm sm:text-base">
              Transacciones protegidas y confiables para tu tranquilidad.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <span className="text-4xl">📞</span>
            <h2 className="font-bold text-xl">Atención al Cliente</h2>
            <p className="text-sm sm:text-base">
              Resolvemos tus dudas y pedidos personalizados rápidamente.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter / Promo CTA Section */}

      <Suspense fallback={<div>Loading newsletter...</div>}>
        <NewsletterCTA redirectTo="/signup" /> {/* LAZY-LOAD UPDATE */} {/* new: pass redirect target to CTA */}
      </Suspense>

      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50 bg-white border-t shadow-lg px-4 py-3">
        <a
          href="/products"
          aria-label="Ver productos disponibles"
          className="block w-full text-center bg-blue-600 text-white font-semibold py-3 rounded-lg active:scale-95 transition"
        >
          Ver Productos
        </a>
      </div>
    </div>
  );
}

export default Home;