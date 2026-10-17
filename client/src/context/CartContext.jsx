import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
const MAX_QTY = 10; // same limit as the backend

const readCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("cart"));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (medicine, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === medicine._id);
      if (existing) {
        return prev.map((i) =>
          i._id === medicine._id ? { ...i, qty: Math.min(i.qty + qty, MAX_QTY) } : i
        );
      }
      return [
        ...prev,
        {
          _id: medicine._id,
          name: medicine.name,
          image: medicine.image,
          category: medicine.category,
          price: medicine.price,
          mrp: medicine.mrp,
          packSize: medicine.packSize,
          qty: Math.min(qty, MAX_QTY),
        },
      ];
    });
  };

  const updateQty = (id, qty) =>
    setItems((prev) =>
      prev.map((i) =>
        i._id === id ? { ...i, qty: Math.min(Math.max(qty, 1), MAX_QTY) } : i
      )
    );

  const removeFromCart = (id) =>
    setItems((prev) => prev.filter((i) => i._id !== id));

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQty, removeFromCart, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);