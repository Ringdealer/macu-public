// frontend/src/components/FeaturedProducts.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SkeletonCard from "./SkeletonCard";
import { getProducts } from "../services/api";
import { HiShoppingCart } from "react-icons/hi2";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { FALLBACK_IMAGE } from "../services/config"; // new

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart") || "[]")
  );

  useEffect(() => {
    getProducts(1)
      .then((data) => {
        setProducts(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const increaseQuantity = (id) =>
    setQuantities((q) => ({ ...q, [id]: (q[id] || 1) + 1 }));

  const decreaseQuantity = (id) =>
    setQuantities((q) => ({ ...q, [id]: Math.max((q[id] || 1) - 1, 1) }));

  const addToCart = (product) => {
    const qty = quantities[product.id] || 1;
    const current = [...cart];
    const existsIndex = current.findIndex(
      (item) => item.product === product.id
    );

    if (existsIndex >= 0) {
      current[existsIndex].quantity += qty;
    } else {
      current.push({
        product: product.id,
        quantity: qty,
        name: product.name,
        price: product.price,
        image_url: product.image_url || FALLBACK_IMAGE, // new
      });
    }

    setCart(current);
    localStorage.setItem("cart", JSON.stringify(current));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
        No hay productos destacados.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.slice(0, 4).map((product) => (
        <div
          key={product.id}
          className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm dark:shadow-lg rounded-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 flex flex-col h-full"
        >
          <Link
            to={`/products/${product.id}`}
            className="block flex-grow flex flex-col"
          >
            <div
              className="w-full bg-white dark:bg-gray-900 overflow-hidden flex justify-center items-center mt-4 p-3 flex-shrink-0"
              style={{ height: "220px" }}
            >
              <img
                src={product.image_url || FALLBACK_IMAGE}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_IMAGE;
                }}
              />
            </div>

            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-lg font-semibold mb-2 min-h-[56px] text-gray-900 dark:text-gray-100">
                {product.name}
              </h2>

              <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-auto">
                ${product.price}
              </div>
            </div>
          </Link>

          <div className="p-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden">
              <div
                onClick={() => decreaseQuantity(product.id)}
                className="px-2 py-1 bg-white dark:bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <AiOutlineMinus />
              </div>

              <span className="px-3 min-w-[36px] text-center text-gray-900 dark:text-gray-100">
                {quantities[product.id] || 1}
              </span>

              <div
                onClick={() => increaseQuantity(product.id)}
                className="px-2 py-1 bg-white dark:bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <AiOutlinePlus />
              </div>
            </div>

            <div
              onClick={() => addToCart(product)}
              className={`ml-2 p-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-500 transition`}
            >
              <HiShoppingCart />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeaturedProducts;