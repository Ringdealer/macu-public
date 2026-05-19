// frontend/src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductDetailSkeleton from "../components/ProductDetailSkeleton";
import { getProductById } from "../services/api";
import { FALLBACK_IMAGE } from "../services/config"; // new

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    getProductById(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setError("No pudimos cargar este producto.");
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    if (product.stock <= 0) return;
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const current = Array.isArray(savedCart) ? savedCart : [];

      const existsIndex = current.findIndex(
        (item) => item.product === product.id
      );

      if (existsIndex >= 0) {
        current[existsIndex].quantity += quantity;
      } else {
        current.push({
          product: product.id,
          quantity,
          name: product.name,
          price: product.price,
          image_url: product.image_url || FALLBACK_IMAGE, // new
        });
      }

      localStorage.setItem("cart", JSON.stringify(current));
      window.dispatchEvent(new Event("cartUpdated"));
      alert("Producto añadido al carrito");
    } catch {
      alert("Error al añadir al carrito");
    }
  };

  if (loading) return <ProductDetailSkeleton />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!product) return <p className="text-center">Producto no encontrado</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">
      <Link to="/products" className="text-blue-600">
        ← Volver
      </Link>

      <div className="grid md:grid-cols-2 gap-10 mt-6">
        <div className="bg-gray-50 dark:bg-slate-900 p-6 rounded-xl">
          <img
            src={product.image_url || FALLBACK_IMAGE} // new
            alt={product.name}
            className="max-h-[450px] object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = FALLBACK_IMAGE; // new
            }}
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{product.name}</h1>

          <p className="mt-4 text-slate-600 dark:text-slate-400">
            {product.description}
          </p>

          {/* 🆕 CHARACTERISTICS */}
          {product.characteristics?.description && (
            <div className="mt-4">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Características:</h3>
              <p className="text-gray-600">
                {product.characteristics.description}
              </p>
            </div>
          )}

          {/* 🆕 ORIGIN COUNTRY */}
          {product.origin_country && (
            <div className="mt-4">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">País de origen:</h3>
              <p className="text-gray-600">
                {product.origin_country}
              </p>
            </div>
          )}

          <div className="mt-6 text-3xl text-blue-600 dark:text-blue-400 font-bold">
            ${product.price}
          </div>

          {product.stock <= 0 && (
  <p className="text-red-500 mt-2">No disponible</p>
)}

         <button
  onClick={addToCart}
  disabled={product.stock <= 0} // new
  className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-40" // new
>
  Añadir al carrito
</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;