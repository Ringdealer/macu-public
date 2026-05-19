import React from "react";
import Layout from "../components/layout";

function Home() {
  return (
  
      <div className="flex flex-col items-center space-y-8">

        {/* Hero image */}
        <img
          className="w-full max-w-4xl h-auto rounded-lg shadow-md"
          src="/images/buque.png"
          alt="Buque"
        />

        {/* Main title */}
        <h1 className="text-4xl font-bold text-center text-blue-700">
          Bienvenidos a MACU
        </h1>

        {/* Subtitle */}
        <p className="text-gray-700 text-center max-w-2xl text-lg">
          Movimiento Abastecimiento Confianza Unión: importamos productos esenciales
          para nuestros clientes con seguridad, organización y confianza.
        </p>

        {/* Trust cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-6">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h2 className="font-bold text-lg mb-2 text-blue-600">Productos Importados</h2>
            <p className="text-gray-600 text-sm">
              Selección de alimentos, limpieza y artículos esenciales.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h2 className="font-bold text-lg mb-2 text-blue-600">Pedidos Organizados</h2>
            <p className="text-gray-600 text-sm">
              Compra de forma simple y sigue tu pedido paso a paso.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h2 className="font-bold text-lg mb-2 text-blue-600">Confianza Comercial</h2>
            <p className="text-gray-600 text-sm">
              Servicio pensado para clientes recurrentes y pedidos seguros.
            </p>
          </div>
        </div>

        {/* CTA section */}
        <div className="mt-6 flex flex-col md:flex-row gap-4 justify-center">
          <a
            href="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 font-medium"
          >
            Ver Productos
          </a>
          <a
            href="/about"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 font-medium"
          >
            Acerca de MACU
          </a>
        </div>
      </div>
   
  );
}

export default Home;