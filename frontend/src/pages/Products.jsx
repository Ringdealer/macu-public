// frontend/src/pages/Products.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SkeletonCard from "../components/SkeletonCard";
import { getProducts } from "../services/api";
import Layout from "../components/layout";
import { HiShoppingCart } from "react-icons/hi2";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { FALLBACK_IMAGE } from "../services/config";

function Products({ user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [toasts, setToasts] = useState([]);

  // Fetch products
  const fetchProducts = () => {
    setLoading(true);
    setError(null);

    getProducts(currentPage)
      .then((data) => {
        setProducts(data.results || data);
        setHasNext(data.next !== null);
        setHasPrevious(data.previous !== null);
        setLoading(false);
      })
      .catch(() => {
        setError("No pudimos cargar los productos. Intente nuevamente.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(Array.isArray(savedCart) ? savedCart : []);
    } catch {
      setCart([]);
    }
  }, []);

  // Quantity handlers
  const increaseQuantity = (id) => {
    setQuantities((q) => ({ ...q, [id]: (q[id] || 1) + 1 }));
  };

  const decreaseQuantity = (id) => {
    setQuantities((q) => ({ ...q, [id]: Math.max((q[id] || 1) - 1, 1) }));
  };

  // Add to cart + show toast
  const addToCart = (product) => {
    if (product.stock <= 0) {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message: "Producto sin stock" }]);
      return;
    }

    const qty = quantities[product.id] || 1;
    const current = [...cart];
    const existsIndex = current.findIndex((item) => item.product === product.id);

    if (existsIndex >= 0) {
      current[existsIndex].quantity += qty;
    } else {
      current.push({
        product: product.id,
        quantity: qty,
        name: product.name,
        price: product.price,
        image_url: product.image_url || null,
      });
    }

    setCart(current);
    localStorage.setItem("cart", JSON.stringify(current));
    window.dispatchEvent(new Event("cartUpdated"));

    const id = Date.now();
    setToasts((prev) => [...prev, { id, message: `${product.name} añadido al carrito` }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error)
    return (
      <div className="text-center mt-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchProducts}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );

  // No products
  if (products.length === 0)
    return (
      <div className="text-center mt-16">
        <p className="text-gray-500 text-lg">No hay productos disponibles actualmente.</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 dark:bg-slate-950 min-h-screen">
      
      {/* Toast notifications */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
        {toasts.map((toast) => (
          <div key={toast.id} className="bg-blue-600 text-white px-4 py-2 rounded shadow-lg animate-slideIn">
            {toast.message}
          </div>
        ))}
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700 dark:text-blue-400 mb-10">
        Nuestros Productos
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 shadow-sm rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
          >
            <Link to={`/products/${product.id}`} className="block flex-grow flex flex-col">
              {/* Image */}
              <div
                className="w-full bg-white dark:bg-slate-900 overflow-hidden flex justify-center items-center mt-4 p-3 flex-shrink-0"
                style={{ height: "220px" }}
              >
                <img
                  src={product.image_url || FALLBACK_IMAGE}
                  alt={product.image_url ? product.name : "Imagen no disponible"}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
                />
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col flex-grow">
                {/* Name */}
                <h2 className="text-lg font-semibold mb-2 min-h-[56px] text-slate-900 dark:text-slate-100">
                  {product.name}
                </h2>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 flex-grow line-clamp-3 min-h-[72px]">
                  {product.description}
                </p>

                {/* Origin */}
                {product.origin_country && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">
                    Origen: {product.origin_country}
                  </p>
                )}

                {/* Characteristics */}
                {product.characteristics?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.characteristics.slice(0, 3).map((c, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {/* Price */}
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-auto">
                  ${product.price}
                </div>

                {/* Stock */}
                {product.stock <= 0 && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">Agotado</p>
                )}
              </div>
            </Link>

            {/* Quantity + Add to Cart */}
            <div className="p-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
              
              {/* Quantity controls */}
              <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-md overflow-hidden">
                
                <div
                  onClick={() => decreaseQuantity(product.id)}
                  className="px-2 py-1 bg-white dark:bg-slate-800 flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                >
                  <AiOutlineMinus />
                </div>

                <span className="px-3 min-w-[36px] text-center">
                  {quantities[product.id] || 1}
                </span>

                <div
                  onClick={() => increaseQuantity(product.id)}
                  className="px-2 py-1 bg-white dark:bg-slate-800 flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                >
                  <AiOutlinePlus />
                </div>
              </div>

              {/* Add to Cart button */}
              <div className="ml-2">
                <button
                  className="p-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-400 hover:scale-105 transition relative disabled:opacity-40"
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                >
                  <HiShoppingCart />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 gap-4">
        {hasPrevious && (
          <button
            onClick={() => {
              setCurrentPage((p) => p - 1);
              window.scrollTo({ top: 0, behavior: "auto" });
            }}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Anterior
          </button>
        )}

        {hasNext && (
          <button
            onClick={() => {
              setCurrentPage((p) => p + 1);
              window.scrollTo({ top: 0, behavior: "auto" });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
}

export default Products;