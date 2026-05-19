// frontend/src/components/orders/OrderForm.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { API_BASE } from "../../services/config";

function OrderForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    status: "",
    order_items: [],
    phone: "",
    address: "",
  });

  // ---------------- PHONE SPLIT (LIKE PROFILE) ----------------
  const [phoneCountryCode, setPhoneCountryCode] = useState("+53");
  const [phoneNumber, setPhoneNumber] = useState("");

  // ✅ FIX: checked by default
  const [saveProfile, setSaveProfile] = useState(true);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false); // new
  const [activeIndex, setActiveIndex] = useState(null); // new
  const [cart, setCart] = useState([]); // new

  // Load products
  useEffect(() => {
    fetch(`${API_BASE}/en/api/v1/products/`)
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : data.results || []);
        setLoadingProducts(false);
      })
      .catch((err) => {
        console.error(err);
        setErrorProducts("No se pudieron cargar los productos.");
        setLoadingProducts(false);
      });
  }, []);

  // ---------------- LOAD PROFILE ----------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/en/api/v1/profile/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const data = await res.json();

        const fullPhone = data.phone_number || "";

        let countryCode = "+53";
        let number = fullPhone;

        if (fullPhone.startsWith("+")) {
          const knownCodes = ["+1242", "+1", "+34", "+52", "+53", "+57"]; 

          const detected = knownCodes.find((code) =>
            fullPhone.startsWith(code),
          );

          if (detected) {
            countryCode = detected;
            number = fullPhone.slice(detected.length);
          } else {
            const match = fullPhone.match(/^(\+\d{1,4})(.+)$/);
            if (match) {
              countryCode = match[1];
              number = match[2];
            }
          }
        }

        setPhoneCountryCode(countryCode);
        setPhoneNumber(number);

        setFormData((prev) => ({
          ...prev,
          address: data.address || "",
        }));
      } catch (err) {
        console.error("PROFILE FETCH ERROR:", err);
      }
    };

    fetchProfile();
  }, []);

  // ---------------- ORDER LOAD ----------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (id) {
      fetch(`${API_BASE}/en/api/v1/orders/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("HTTP error " + res.status);
          return res.json();
        })
        .then((data) =>
          setFormData({
            status: data.status || "",
            phone: data.phone || "",
            address: data.address || "",
            order_items: data.order_items.map((item) => ({
              product: item.product.id,
              quantity: item.quantity,
            })),
          }),
        )
        .catch((err) => console.error(err));
    } else {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (savedCart.length > 0) {
        const items = savedCart.map((c) => ({
          product: c.product,
          quantity: c.quantity,
        }));
        setFormData((prev) => ({ ...prev, order_items: items }));
      }
    }
  }, [id]);

  useEffect(() => {
  try {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(Array.isArray(savedCart) ? savedCart : []);
  } catch {
    setCart([]);
  }
}, []); // new

  // ---------------- HANDLE CHANGE ----------------
  const handleChange = (e, index = null) => {
    const { name, value } = e.target;

    if (name === "product" || name === "quantity") {
      const items = [...formData.order_items];

      if (name === "product") {
        const selectedProduct = Number(value);

const duplicate = items.some(
  (item, idx) => item.product === selectedProduct && idx !== index
);

if (duplicate) {
  alert("Este producto ya existe en el pedido"); // new
  return;
}

items[index].product = selectedProduct;
      }

      if (name === "quantity") {
        items[index].quantity = Number(value);
      }

      setFormData({ ...formData, order_items: items });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddItem = () => {
    if (products.length === 0) return;
    setFormData({
      ...formData,
      order_items: [...formData.order_items, { product: "", quantity: 1 }],
    });
  };

  const handleSelectProduct = (productId) => {
    // new
    const items = [...formData.order_items]; // new

      // check if product already exists in order
  const existsIndex = items.findIndex(
    (i, idx) => i.product === productId && idx !== activeIndex
  );

  if (existsIndex !== -1) {
    alert("Este producto ya está en el pedido"); // new
    setShowProductModal(false);
    return;
  }

    items[activeIndex].product = productId; // new
    setFormData({ ...formData, order_items: items }); // new
    setShowProductModal(false); // new
  }; // new

  const handleIncrement = (index) => {
    const items = [...formData.order_items];
    items[index].quantity += 1;
    setFormData({ ...formData, order_items: items });
  };

  const handleDecrement = (index) => {
    const items = [...formData.order_items];
    if (items[index].quantity > 1) {
      items[index].quantity -= 1;
      setFormData({ ...formData, order_items: items });
    }
  };

  // ---------------- PROFILE UPDATE HELPER ----------------
  const updateProfile = async (token, fullPhone, address) => {
    return fetch(`${API_BASE}/en/api/v1/profile/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        phone_number: fullPhone,
        address: address,
      }),
    });
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return;

    const fullPhone =
      phoneNumber.trim() !== ""
        ? `${phoneCountryCode}${phoneNumber.trim()}`
        : "";

    const payload = {
      status: id ? formData.status : "pending",
      phone: fullPhone,
      address: formData.address,
      order_items: formData.order_items.map((item) => ({
        product: Number(item.product),
        quantity: item.quantity,
      })),
    };

    try {
      const url = id
        ? `${API_BASE}/en/api/v1/orders/${id}/`
        : `${API_BASE}/en/api/v1/orders/`;

      const response = await fetch(url, {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      const result = await response.json();
      console.log("Pedido enviado con éxito:", result);

      // ✅ ONLY update profile if checkbox is checked
      if (saveProfile) {
        try {
          await updateProfile(token, fullPhone, formData.address);
        } catch (err) {
          console.warn("Profile update failed:", err);
        }
      }

      if (!id) localStorage.removeItem("cart");
      navigate("/orders", { state: { refresh: true } });
    } catch (err) {
      console.error(err);

      let message = "Error al procesar el pedido";

      try {
        const parsed = JSON.parse(err.message);

        if (parsed.phone) {
          message = Array.isArray(parsed.phone)
            ? parsed.phone[0]
            : parsed.phone;
        } else if (parsed.detail) {
          message = parsed.detail;
        }
      } catch (e) {
        message = err.message;
      }

      alert(message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Link
        to="/cart"
        className="inline-block mb-4 text-blue-600 hover:underline font-medium"
      >
        ← Volver al Carrito
      </Link>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-8">
          {id ? "Editar Pedido" : "Crear Nuevo Pedido"}
        </h1>

        {/* PHONE */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Teléfono (opcional)</label>

          <div className="flex gap-2">
            <select
              value={phoneCountryCode}
              onChange={(e) => setPhoneCountryCode(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-3 rounded-md"
            >
              <option value="+53">🇨🇺 +53</option>
              <option value="+52">🇲🇽 +52</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+1242">🇧🇸 +1 242</option>
              <option value="+34">🇪🇸 +34</option>
              <option value="+57">🇨🇴 +57</option>
            </select>

            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-3 rounded-md w-full"
              placeholder="Número"
            />
          </div>
        </div>

        {/* ADDRESS */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Dirección</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-3 rounded-md w-full"
            rows={2}
          />
        </div>

        {/* CHECKBOX */}
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="saveProfile"
            checked={saveProfile}
            onChange={(e) => setSaveProfile(e.target.checked)}
          />
          <label htmlFor="saveProfile" className="text-sm">
            Guardar teléfono y dirección para futuros pedidos
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          {formData.order_items.map((item, index) => (
            <div key={index} className="mb-4 border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <button
                type="button"
                onClick={() => {
                  setActiveIndex(index); // new
                  setShowProductModal(true); // new
                }}
                className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-md text-left bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 mb-3"
              >
                {item.product
                  ? products.find((p) => p.id === item.product)?.name
                  : "Seleccione un producto"}
              </button>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => handleDecrement(index)}
                    className="text-gray-700 dark:text-gray-200 px-2">
                  -
                </button>

                <input
           
  type="number"
  name="quantity"
  value={item.quantity}
  onChange={(e) => handleChange(e, index)}
  min="1"
  className="
    w-20 text-center p-2 rounded-md
    border border-gray-300 dark:border-gray-600
    bg-white dark:bg-gray-900
    text-gray-900 dark:text-gray-100
    focus:outline-none focus:ring-2 focus:ring-blue-500
  "
/>
              

                <button type="button" onClick={() => handleIncrement(index)}
                    className="text-gray-700 dark:text-gray-200 px-2">
                  +
                </button>
              </div>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
         <button
  type="button"
  onClick={handleAddItem}
  className="
    bg-gray-200 dark:bg-gray-700
    text-gray-900 dark:text-gray-100
    px-4 py-2 rounded-md
    hover:bg-gray-300 dark:hover:bg-gray-600
    transition font-medium
  "
>
  Agregar Producto
</button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 transition-all font-medium text-lg"
            >
              Enviar Pedido
            </button>
          </div>
        </form>
      </div>
      {/* PRODUCT MODAL */} {/* new */}
{showProductModal && ( // new
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50"> {/* new */}

    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full sm:max-w-md rounded-t-xl sm:rounded-xl p-4 max-h-[80vh] overflow-y-auto">

      <h2 className="text-lg font-bold mb-4">
        Seleccione un producto
      </h2>

      {products.map((p) => { // new
        const cartItem = cart.find((c) => c.product === p.id); // new

        return ( // new
          <div
            key={p.id}
            onClick={() => handleSelectProduct(p.id)}
            className="flex items-center justify-between gap-3 p-3 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex items-center gap-3">
              <img
                src={p.image_url || "/images/fallback.webp"}
                alt={p.name}
                className="w-14 h-14 object-contain rounded-md bg-white border"
              />

              <div className="flex flex-col">
                <span className="font-medium text-sm">{p.name}</span>
                <span className="text-blue-600 font-semibold text-sm">
                  ${p.price}
                </span>
              </div>
            </div>

            {/* CART BADGE */} {/* new */}
            {cartItem && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                x{cartItem.quantity}
              </span>
            )}
          </div>
        );
      })}

     <button
  onClick={() => setShowProductModal(false)}
  className="
    mt-4 w-full
    bg-gray-200 dark:bg-gray-700
    text-gray-900 dark:text-gray-100
    py-2 rounded-md
    hover:bg-gray-300 dark:hover:bg-gray-600
    transition
  "
>
  Cancelar
</button>

    </div>
  </div>
)} {" "}
      
    </div>
  );
}

export default OrderForm;
