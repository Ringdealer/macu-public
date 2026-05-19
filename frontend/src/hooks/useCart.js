import { useState, useEffect, useCallback } from "react";

// Custom hook to manage cart with localStorage sync and live updates
export default function useCart() {
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart") || "[]")
  );

  // Sync cart from localStorage when 'cartUpdated' event is dispatched
  const syncCart = useCallback(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(Array.isArray(saved) ? saved : []);
  }, []);

  useEffect(() => {
    window.addEventListener("cartUpdated", syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener("cartUpdated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, [syncCart]);

  // Function to update cart and dispatch event
  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const clearCart = () => updateCart([]);

  return { cart, setCart: updateCart, clearCart };
}