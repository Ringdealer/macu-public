// frontend/src/components/orders/OrderDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE } from "../../services/config";

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [canceling, setCanceling] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No se encontró token de autenticación."); 
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/en/api/v1/orders/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) throw new Error("HTTP error " + response.status);

      const data = await response.json();

      const mappedItems = (data.order_items || []).map((item) => ({
        id: item.id || Math.random(),
        quantity: item.quantity,
        product_name: item.product_name || item.product,
      }));

      setOrder({
        ...data,
        items: mappedItems,
      });
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("No se pudo cargar el pedido."); 
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    if (!window.confirm("¿Seguro que deseas cancelar este pedido?")) return;

    setCanceling(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE}/en/api/v1/orders/${id}/cancel/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) throw new Error("No se pudo cancelar el pedido.");

      setOrder((prev) => ({ ...prev, status: "cancelled" }));
    } catch (err) {
      console.error(err);
      alert("No se pudo cancelar el pedido.");
    } finally {
      setCanceling(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3"></div>
        <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"></div>
        <div className="h-6 bg-gray-200 animate-pulse rounded w-1/5"></div>
        <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
        <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchOrder}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 hover:shadow-md transition font-medium"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!order)
    return <p className="text-center mt-10 text-gray-500">Pedido no encontrado.</p>;

  const statusMap = {
    pending: "Pendiente",
    confirmed: "Confirmado",
    delivered: "Entregado",
    cancelled: "Cancelado",
  };

  const statusBadgeClass = {
    pending: "bg-blue-100 text-blue-700",
    confirmed: "bg-green-100 text-green-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Pedido #{order.id}</h1>

      
      <p className="mb-4 flex items-center gap-3">
        <strong>Estado:</strong> 
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadgeClass[order.status]}`}>
          {statusMap[order.status] || order.status}
        </span>
      </p>

      {order.status === "pending" && (
        <button
          onClick={cancelOrder}
          disabled={canceling}
          className="mb-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 hover:shadow-md transition font-medium"
        >
          {canceling ? "Cancelando..." : "Cancelar pedido"}
        </button>
      )}

      <h2 className="text-lg font-bold mt-4 mb-2">Productos</h2>

      {order.items && order.items.length > 0 ? (
        <ul className="list-disc ml-5 space-y-1">
          {order.items.map((item) => (
            <li key={item.id}>
              {item.quantity} x {item.product_name || item.product}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No hay productos en este pedido.</p>
      )}

      <Link
        to="/orders"
        className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 hover:shadow-md transition font-medium"
      >
        Volver a Pedidos
      </Link>
    </div>
  );
}

export default OrderDetail;