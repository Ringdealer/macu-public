// frontend/src/components/orders/Cart.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout";

function Cart() {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null); // new

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(Array.isArray(savedCart) ? savedCart : []);
    } catch {
      setCart([]);
      setError("Hubo un problema al cargar el carrito.");
    }
  }, []);

  // Remove an item from cart
  const removeItem = (productId) => {
    const updatedCart = cart.filter((item) => item.product !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Update quantity
  const updateQuantity = (productId, qty) => {
    const safeQty = Math.max(qty || 1, 1);

    const updatedCart = cart
      .map((item) =>
        item.product === productId ? { ...item, quantity: safeQty } : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const total = cart.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100"> {/* new */}

      <Link
        to="/products"
        className="inline-block mb-4 text-blue-600 dark:text-blue-400 hover:underline font-medium" // new
      >
        ← Volver a Productos
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Tu Carrito
      </h1>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {cart.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          El carrito está vacío.{" "}
          <Link
            to="/products"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Ver productos
          </Link>
        </p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6"> {/* new */}

            <table className="w-full bg-white dark:bg-gray-800"> {/* new */}

              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700"> {/* new */}
                  <th className="p-3 text-left">Producto</th>
                  <th className="p-3">Precio</th>
                  <th className="p-3">Cantidad</th>
                  <th className="p-3">Subtotal</th>
                  <th className="p-3">Acción</th>
                </tr>
              </thead>

              <tbody>
                {cart.map((item) => (
                  <tr
                    key={item.product}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" // new
                  >
                    <td className="p-3">
                      <div className="flex flex-col sm:flex-row items-center gap-2">

                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md shadow-sm"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/images/fallback.png";
                            }}
                          />
                        )}

                        <div className="text-center sm:text-left mt-1 sm:mt-0">
                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                            {item.name}
                          </div>

                          {item.bulk && (
                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded">
                              {item.bulk}
                            </span>
                          )}
                        </div>

                      </div>
                    </td>

                    <td className="p-3 text-blue-600 dark:text-blue-400 font-semibold">
                      ${item.price}
                    </td>

                    <td className="p-3">
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        className="w-16 border rounded px-2 py-1 text-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) =>
                          updateQuantity(item.product, parseInt(e.target.value))
                        }
                      />
                    </td>

                    <td className="p-3 font-bold text-gray-900 dark:text-gray-100">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </td>

                    <td className="p-3">
                      <button
                        className="text-red-600 dark:text-red-400 hover:underline font-medium"
                        onClick={() => removeItem(item.product)}
                      >
                        Eliminar
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          <div className="text-right font-bold text-2xl mb-6 text-blue-600 dark:text-blue-400">
            Total: ${total.toFixed(2)}
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4">

            <Link
              to="/products"
              className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium text-center"
            >
              Seguir Comprando
            </Link>

            <Link
              to="/orders/new"
              className="bg-blue-600 text-white px-6 py-2 rounded font-medium inline-block hover:bg-blue-700 hover:shadow-md transition text-center"
            >
              Ir a Finalizar Pedido
            </Link>

          </div>
        </>
      )}
    </div>
  );
}

export default Cart;