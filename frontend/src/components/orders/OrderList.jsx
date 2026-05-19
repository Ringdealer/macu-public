// frontend/src/components/orders/OrderList.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { API_BASE } from "../../services/config";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/en/api/v1/orders/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) throw new Error("HTTP error " + response.status);
      const data = await response.json();

      setOrders(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("No se pudieron cargar los pedidos.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    const confirmed = window.confirm("¿Seguro que deseas cancelar este pedido?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_BASE}/en/api/v1/orders/${orderId}/cancel/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Cancel failed");

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "cancelled" } : o
        )
      );
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("No se pudo cancelar el pedido.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [location.state]);

  if (loading) {
    return (
      <div className="w-full px-4 py-8 sm:max-w-5xl sm:mx-auto space-y-4">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className="h-20 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl w-full"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchOrders}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition font-medium"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500 dark:text-gray-400">
        No tienes pedidos aún.
      </p>
    );
  }

  const statusMap = {
    pending: "Pendiente",
    confirmed: "Confirmado",
    delivered: "Entregado",
    cancelled: "Cancelado",
  };

  return (
    <div className="w-full px-4 py-8 sm:max-w-5xl sm:mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Pedidos
      </h1>

      <div className="space-y-4 mb-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-gray-900 shadow-sm rounded-xl p-5 border border-gray-200 dark:border-gray-800 overflow-hidden w-full"
          >
            <Link
              to={`/orders/${order.id}`}
              className="block hover:opacity-90"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div className="flex flex-col gap-1 break-words">
                  <div className="font-semibold text-lg text-gray-900 dark:text-white">
                    Pedido #{order.id}
                  </div>
                </div>

                <span
                  className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium w-full sm:w-max text-center ${
                    order.status === "pending"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : order.status === "cancelled"
                      ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                      : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                  }`}
                >
                  {statusMap[order.status] || order.status}
                </span>
              </div>
            </Link>

            {order.status === "pending" && (
              <button
                onClick={() => cancelOrder(order.id)}
                className="mt-3 text-sm text-red-600 dark:text-red-400 hover:underline"
              >
                Cancelar pedido
              </button>
            )}
          </div>
        ))}
      </div>

      <Link
        to="/orders/new"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition font-medium"
      >
        Crear Nuevo Pedido
      </Link>
    </div>
  );
}

export default OrderList;