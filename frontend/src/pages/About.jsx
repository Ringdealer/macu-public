// frontend/src/pages/About.jsx
import React from 'react';
import Layout from '../components/layout';

function About({ user }) {
  return (
   
      <div className="max-w-3xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold text-center">
          Acerca de MACU
        </h1>

        <p className="text-gray-700">
          MACU (Movimiento Abastecimiento Confianza Unión) es una plataforma
          diseñada para facilitar el abastecimiento de productos esenciales
          para comunidades con acceso limitado a ciertos bienes.
        </p>

        <p className="text-gray-700">
          Nuestro objetivo es conectar a las personas que necesitan productos
          con un sistema confiable de importación y distribución.
        </p>

        <p className="text-gray-700">
          Los usuarios pueden crear cuentas, explorar productos disponibles,
          realizar pedidos y seguir el estado de sus órdenes de manera
          sencilla y segura.
        </p>

        <div className="flex justify-center">
          <img
            className="w-full max-w-4xl h-auto rounded-lg shadow-md"
            src="/images/macu-256.webp"
            alt="Contenedor de carga"
            
          />
        </div>

      </div>
   
  );
}

export default About;