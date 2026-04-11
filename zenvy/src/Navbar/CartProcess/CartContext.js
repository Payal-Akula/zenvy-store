/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
const API = "https://zenvy-store.onrender.com/api/cart";

export function CartProvider({ children }) {

  const [cart, setCart] = useState([]);

  const [paymentMethodState, setPaymentMethodState] = useState(
    localStorage.getItem("paymentMethod") || "UPI"
  );

  const userId = localStorage.getItem("userId");

  // ✅ PAYMENT METHOD
  const setPaymentMethod = (method) => {
    setPaymentMethodState(method);
    localStorage.setItem("paymentMethod", method);
  };

  useEffect(() => {
    const saved = localStorage.getItem("paymentMethod");
    if (saved) setPaymentMethod(saved);
  }, []);

  // ✅ FETCH CART (FIXED)
  const fetchCart = async (uid) => {
    try {
      if (!uid) {
        console.warn("❌ No userId found");
        return;
      }

      const res = await fetch(`${API}/${uid}`);
      const data = await res.json();

      console.log("🟢 API CART RESPONSE:", data);

      // ✅ SAFETY CHECK
      if (!data || !Array.isArray(data.items)) {
        setCart([]);
        return;
      }

      // ✅ NORMALIZE DATA
      const formatted = data.items.map((item) => ({
        id: item.id,              
        title: item.title,
        price: item.price,
        image: item.image,
        quantity: item.quantity
      }));

      setCart(formatted);

    } catch (err) {
      console.error("❌ fetchCart error:", err);
      setCart([]);
    }
  };

  // ✅ LOAD CART ON APP START
  useEffect(() => {
    if (userId) {
      fetchCart(userId);
    }
  }, [userId]);

  // ✅ ADD TO CART (FIXED)
  const addToCart = async (product) => {
    try {
      if (!product.id) {
        console.error("❌ product.id missing", product);
        return;
      }

      if (!userId) {
        console.warn("❌ User not logged in");
        return;
      }

      await fetch(`${API}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          productId: product.id,   // ✅ MUST be ObjectId string
          quantity: product.quantity || 1
        })
      });

      // 🔥 IMPORTANT: refresh with userId
      await fetchCart(userId);

    } catch (err) {
      console.error("❌ addToCart error:", err);
    }
  };

  // ✅ REMOVE ITEM (FIXED)
  const removeFromCart = async (id) => {
    try {
      await fetch(`${API}/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId, 
          productId: id
        })
      });

      await fetchCart(userId);

    } catch (err) {
      console.error("❌ removeFromCart error:", err);
    }
  };

  // ✅ UPDATE QUANTITY (FIXED)
  const updateQuantity = async (id, quantity) => {
    try {
      await fetch(`${API}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          productId: id,
          quantity
        })
      });

      await fetchCart(userId);

    } catch (err) {
      console.error("❌ updateQuantity error:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        paymentMethod: paymentMethodState,
        setPaymentMethod
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}