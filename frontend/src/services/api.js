//frontend/src/services/api.js
import { API_BASE } from "./config";

/**
 * Universal authenticated fetch for Django token auth
 */
async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("token");

  const isFormData = options.body instanceof FormData;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Token ${token}` } : {}),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  return response;
}

/* =========================
   PRODUCTS
========================= */

export async function getProducts(page = 1) {
  const response = await fetchWithAuth(
    `${API_BASE}/en/api/v1/products/?page=${page}`
  );

  if (!response.ok) throw new Error("Failed to fetch products");

  return await response.json();
}

export async function getProductById(id) {
  const response = await fetchWithAuth(
    `${API_BASE}/en/api/v1/products/${id}/`
  );

  if (!response.ok) throw new Error("Failed to fetch product");

  return await response.json();
}

export async function createProduct(data) {
  const isFormData = data instanceof FormData;

  const response = await fetchWithAuth(
    `${API_BASE}/en/api/v1/products/`,
    {
      method: "POST",
      body: isFormData ? data : JSON.stringify(data),
    }
  );

  const text = await response.text();

  if (!response.ok) {
  console.error("Create product error:", text);

  let errorData;
  try {
    errorData = JSON.parse(text);
  } catch {
    throw new Error("Error desconocido");
  }

  throw errorData; // new (send real backend error)
}

  return JSON.parse(text);
}

export async function updateProduct(id, data) {
  const isFormData = data instanceof FormData;

  const response = await fetchWithAuth(
    `${API_BASE}/en/api/v1/products/${id}/`,
    {
      method: "PATCH",
      body: isFormData ? data : JSON.stringify(data),
    }
  );

  const text = await response.text();

  if (!response.ok) {
    console.error("Update product error:", text);
    throw new Error("Failed to update product");
  }

  return JSON.parse(text);
}

export async function deleteProduct(id) {
  const response = await fetchWithAuth(
    `${API_BASE}/en/api/v1/products/${id}/`,
    { method: "DELETE" }
  );

  if (!response.ok) throw new Error("Failed to delete product");

  return true;
}

/* =========================
   ORDERS
========================= */

export async function getOrders(page = 1) {
  const response = await fetchWithAuth(
    `${API_BASE}/en/api/v1/orders/?page=${page}`
  );

  const text = await response.text();

  if (!response.ok) {
    console.error("Orders API error:", text);
    throw new Error("Failed to fetch orders");
  }

  return JSON.parse(text);
}

export async function getOrderById(id) {
  const response = await fetchWithAuth(
    `${API_BASE}/en/api/v1/orders/${id}/`
  );

  if (!response.ok) throw new Error("Failed to fetch order");

  return await response.json();
}

export async function updateOrderStatus(id, data) {
  const response = await fetchWithAuth(
    `${API_BASE}/en/api/v1/orders/${id}/`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );

  const text = await response.text();

  if (!response.ok) {
    console.error("Update order error:", text);
    throw new Error("Failed to update order");
  }

  return JSON.parse(text);
}

/* =========================
   LOW STOCK
========================= */

export async function getLowStockProducts() {
  const response = await fetchWithAuth(
    `${API_BASE}/en/api/v1/low-stock/`
  );

  const text = await response.text();

  if (!response.ok) {
    console.error("Low stock API error:", text);
    throw new Error("Failed to fetch low stock products");
  }

  return JSON.parse(text);
}

/* =========================
   CUSTOMERS
========================= */

export async function getCustomers(page = 1) {
  const response = await fetchWithAuth(
    `${API_BASE}/en/api/v1/customers/?page=${page}`
  );

  const text = await response.text();

  if (!response.ok) {
    console.error("Customers API error:", text);
    throw new Error("Failed to fetch customers");
  }

  return JSON.parse(text);
}

export async function getCustomerById(id) {
  const response = await fetchWithAuth(
    `${API_BASE}/en/api/v1/customers/${id}/`
  );

  if (!response.ok) throw new Error("Failed customer");

  return await response.json();
}

export async function updateCustomer(id, data) {
  const response = await fetchWithAuth(
    `${API_BASE}/en/api/v1/customers/${id}/`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );

  const text = await response.text();

  if (!response.ok) {
    console.error("Update customer error:", text);
    throw new Error("Failed to update customer");
  }

  return JSON.parse(text);
}

export async function deleteCustomer(id) {
  const response = await fetchWithAuth(
    `${API_BASE}/en/api/v1/customers/${id}/`,
    { method: "DELETE" }
  );

  if (!response.ok) throw new Error("Failed to delete customer");

  return true;
}

/* =========================
   STOCK MOVEMENTS
========================= */

export async function getStockMovements(productId) {
  const response = await fetchWithAuth(
    `${API_BASE}/en/api/v1/stock-movements/?product=${productId}`
  );

  const text = await response.text();

  if (!response.ok) {
    console.error("Stock movement error:", text);
    throw new Error("Failed to fetch stock movements");
  }

  return JSON.parse(text);
}

/* =========================
   NOTIFICATIONS
========================= */

export const getNotifications = async () => {
  const response = await fetchWithAuth(
    `${API_BASE}/en/api/v1/notifications/`
  );

  const text = await response.text();

  if (!response.ok) {
    console.error("Notification error:", text);
    throw new Error("Failed to fetch notifications");
  }

  return JSON.parse(text);
};

export const getOrderNotifications = async (orderId) => {
  const response = await fetchWithAuth(
    `${API_BASE}/en/api/v1/notifications/?order=${orderId}`
  );

  const text = await response.text();

  if (!response.ok) {
    console.error("Notification error:", text);
    throw new Error("Failed to fetch notifications");
  }

  return JSON.parse(text);
};

export const retryNotification = async (id) => {
  const response = await fetchWithAuth(
    `${API_BASE}/en/api/v1/notifications/${id}/retry/`,
    {
      method: "POST",
    }
  );

  const text = await response.text();

  if (!response.ok) {
    console.error("Retry error:", text);
    throw new Error("Failed to retry notification");
  }

  return JSON.parse(text);
};

/* =========================
   ADMIN NOTES
========================= */

export const getOrderNotes = async (orderId) => {
  const response = await fetchWithAuth(
    `${API_BASE}/en/api/v1/notes/?order=${orderId}`
  );

  const text = await response.text();

  if (!response.ok) {
    console.error("Admin notes error:", text);
    throw new Error("Failed to fetch admin notes");
  }

  return JSON.parse(text);
};

export const createOrderNote = async (data) => {
  const response = await fetchWithAuth(
    `${API_BASE}/en/api/v1/notes/`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  const text = await response.text();

  if (!response.ok) {
    console.error("Create note error:", text);
    throw new Error("Failed to create note");
  }

  return JSON.parse(text);
};

export async function getActivityLogs(params = "") {
  const response = await fetchWithAuth(
    `${API_BASE}/en/api/v1/activity-logs/${params ? `?${params}` : ""}`
  );

  const text = await response.text();

  if (!response.ok) {
    console.error("Activity log error:", text);
    throw new Error("Failed to fetch activity logs");
  }

  return JSON.parse(text);
}

export async function createCustomer(data) {
  const response = await fetchWithAuth(
    `${API_BASE}/en/api/v1/customers/`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  const json = await response.json();

  return {
    data: json,
    status: response.status,
  };
}

// =========================
// CATEGORIES
// =========================

export async function getCategories() {
  const response = await fetchWithAuth(
    `${API_BASE}/en/api/v1/categories/`
  );

  const text = await response.text();

  if (!response.ok) {
    console.error("Categories API error:", text);
    throw new Error("Failed to fetch categories");
  }

  return JSON.parse(text);
}