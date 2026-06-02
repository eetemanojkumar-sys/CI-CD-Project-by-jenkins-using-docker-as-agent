import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Phone, ShoppingBag, X, Plus, Minus, ArrowLeft } from "lucide-react";
import { useCart, type OrderType } from "@/context/CartContext";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

const brandEase: [number, number, number, number] = [0.19, 1, 0.22, 1];

const checkoutSchema = z
  .object({
    name: z
      .string()
      .trim()
      .nonempty({ message: "Please enter your name" })
      .max(60, { message: "Name must be under 60 characters" }),
    orderType: z.enum(["dine-in", "takeaway"]),
    tableOrNotes: z
      .string()
      .trim()
      .max(120, { message: "Keep notes under 120 characters" }),
    address: z
      .string()
      .trim()
      .max(200, { message: "Keep address under 200 characters" }),
  })
  .refine(
    (d) => d.orderType !== "takeaway" || d.address.length > 0,
    { path: ["address"], message: "Please enter a pickup/delivery address" },
  );

const BookingBar = () => {
  const {
    items,
    totalItems,
    totalPrice,
    sendToWhatsApp,
    addItem,
    removeItem,
    incrementItem,
    clearCart,
  } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [stage, setStage] = useState<"cart" | "checkout">("cart");
  const [name, setName] = useState("");
  const [orderType, setOrderType] = useState<OrderType>("dine-in");
  const [tableOrNotes, setTableOrNotes] = useState("");

  const closeDrawer = () => {
    setShowCart(false);
    setStage("cart");
  };

  const handleConfirm = () => {
    const result = checkoutSchema.safeParse({ name, orderType, tableOrNotes });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    sendToWhatsApp({
      name: result.data.name ?? "",
      orderType: result.data.orderType ?? "dine-in",
      tableOrNotes: result.data.tableOrNotes ?? "",
    });
    toast.success("Opening WhatsApp with your order…");
    closeDrawer();
  };

  return (
    <>
      {/* Cart Drawer */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-black/60 z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.4, ease: brandEase }}
              className="fixed bottom-16 left-0 right-0 max-h-[70vh] bg-card border-t border-royal-red/30 z-50 overflow-y-auto rounded-t-2xl"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {stage === "checkout" && (
                      <button
                        onClick={() => setStage("cart")}
                        aria-label="Back to cart"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    )}
                    <h3 className="font-serif italic text-xl font-light text-foreground">
                      {stage === "cart" ? "Your Order" : "Your Details"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    {stage === "cart" && items.length > 0 && (
                      <button
                        onClick={clearCart}
                        className="font-mono text-xs text-muted-foreground hover:text-destructive transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                    <button onClick={closeDrawer} aria-label="Close cart">
                      <X className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  </div>
                </div>

                {stage === "cart" ? (
                  items.length === 0 ? (
                    <p className="font-mono text-sm text-muted-foreground py-8 text-center">
                      No items added yet. Tap + to add dishes.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {items.map((item) => (
                        <motion.div
                          key={item.name}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="flex items-center justify-between py-2 gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-serif italic text-sm text-foreground truncate">
                              {item.name}
                            </p>
                            <p className="font-mono text-xs text-muted-foreground">
                              ₹{item.price} each
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeItem(item.name)}
                              aria-label={`Decrease ${item.name}`}
                              className="w-7 h-7 rounded-full border border-royal-red/40 flex items-center justify-center text-foreground hover:bg-secondary/60 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono text-sm text-accent w-5 text-center tabular-nums">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => incrementItem(item.name)}
                              aria-label={`Increase ${item.name}`}
                              className="w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:brightness-110 transition-all"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <span className="font-mono text-sm text-accent tabular-nums w-14 text-right">
                              ₹{item.price * item.qty}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                      <div className="border-t border-royal-red/30 pt-3 mt-2 flex items-center justify-between">
                        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                          Total
                        </span>
                        <span className="font-mono text-lg text-accent tabular-nums">₹{totalPrice}</span>
                      </div>
                      <button
                        onClick={() => setStage("checkout")}
                        className="mt-2 w-full bg-[#25D366] text-white py-3 rounded-lg font-mono text-sm uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Continue
                      </button>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={60}
                        placeholder="Your name"
                        className="bg-background border border-royal-red/30 rounded-lg px-3 py-2.5 font-mono text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        Order Type
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(["dine-in", "takeaway"] as OrderType[]).map((type) => (
                          <button
                            key={type}
                            onClick={() => setOrderType(type)}
                            className={`py-2.5 rounded-lg font-mono text-xs uppercase tracking-widest border transition-colors ${
                              orderType === type
                                ? "bg-accent text-accent-foreground border-accent"
                                : "border-royal-red/30 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {type === "dine-in" ? "Dine-in" : "Takeaway"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        {orderType === "dine-in" ? "Table No. (optional)" : "Notes (optional)"}
                      </label>
                      <input
                        type="text"
                        value={tableOrNotes}
                        onChange={(e) => setTableOrNotes(e.target.value)}
                        maxLength={120}
                        placeholder={orderType === "dine-in" ? "e.g. Table 7" : "e.g. Less spicy"}
                        className="bg-background border border-royal-red/30 rounded-lg px-3 py-2.5 font-mono text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>

                    <div className="border-t border-royal-red/30 pt-3 flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        Total ({totalItems})
                      </span>
                      <span className="font-mono text-lg text-accent tabular-nums">₹{totalPrice}</span>
                    </div>

                    <button
                      onClick={handleConfirm}
                      className="w-full bg-[#25D366] text-white py-3 rounded-lg font-mono text-sm uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Send Order on WhatsApp
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 1, ease: brandEase }}
        className="fixed bottom-0 left-0 right-0 h-16 flex z-50"
      >
        {totalItems > 0 ? (
          <>
            <button
              onClick={() => {
                setStage("cart");
                setShowCart((s) => !s);
              }}
              className="flex-1 bg-secondary text-foreground flex items-center justify-center gap-2 active:scale-[0.98] transition-transform duration-300 relative"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="font-mono text-sm font-medium tracking-tight uppercase">
                Cart ({totalItems})
              </span>
              <span className="font-mono text-xs text-accent ml-1">₹{totalPrice}</span>
            </button>
            <button
              onClick={() => {
                setStage("checkout");
                setShowCart(true);
              }}
              className="flex-1 bg-[#25D366] text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-transform duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="font-mono text-sm font-medium tracking-tight uppercase">
                Checkout
              </span>
            </button>
          </>
        ) : (
          <>
            <a
              href="https://wa.me/917075959303?text=Hi%20Brundavanam!%20I%20would%20like%20to%20order%20food."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#25D366] text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-transform duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="font-mono text-sm font-medium tracking-tight uppercase">
                Order on WhatsApp
              </span>
            </a>
            <a
              href="tel:7075959303"
              className="flex-1 bg-accent text-accent-foreground flex items-center justify-center gap-2 active:scale-[0.98] transition-transform duration-300"
            >
              <Phone className="w-4 h-4" />
              <span className="font-mono text-sm font-medium tracking-tight uppercase">
                Call to Reserve
              </span>
            </a>
          </>
        )}
      </motion.div>
    </>
  );
};

export default BookingBar;
