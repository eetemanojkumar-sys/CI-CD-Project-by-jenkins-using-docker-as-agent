import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface CartItem {
  name: string;
  price: number;
  qty: number;
}

export type OrderType = "dine-in" | "takeaway";

export interface CustomerDetails {
  name: string;
  orderType: OrderType;
  tableOrNotes: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (name: string, price: number) => void;
  removeItem: (name: string) => void;
  incrementItem: (name: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  sendToWhatsApp: (details: CustomerDetails) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((name: string, price: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.name === name);
      if (existing) {
        return prev.map((i) => i.name === name ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { name, price, qty: 1 }];
    });
  }, []);

  const incrementItem = useCallback((name: string) => {
    setItems((prev) => prev.map((i) => i.name === name ? { ...i, qty: i.qty + 1 } : i));
  }, []);

  const removeItem = useCallback((name: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.name === name);
      if (existing && existing.qty > 1) {
        return prev.map((i) => i.name === name ? { ...i, qty: i.qty - 1 } : i);
      }
      return prev.filter((i) => i.name !== name);
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const sendToWhatsApp = useCallback((details: CustomerDetails) => {
    if (items.length === 0) return;
    const orderLines = items.map((i) => `• ${i.name} x${i.qty} — ₹${i.price * i.qty}`).join("\n");
    const typeLabel = details.orderType === "dine-in" ? "Dine-in" : "Takeaway";
    const extraLabel = details.orderType === "dine-in" ? "Table" : "Notes";
    const extraLine = details.tableOrNotes.trim()
      ? `${extraLabel}: ${details.tableOrNotes.trim()}\n`
      : "";
    const message =
      `Hi Brundavanam! New order:\n\n` +
      `Name: ${details.name.trim()}\n` +
      `Type: ${typeLabel}\n` +
      `${extraLine}\n` +
      `${orderLines}\n\n` +
      `Total: ₹${totalPrice}`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/917075959303?text=${encoded}`, "_blank");
  }, [items, totalPrice]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, incrementItem, clearCart, totalItems, totalPrice, sendToWhatsApp }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
