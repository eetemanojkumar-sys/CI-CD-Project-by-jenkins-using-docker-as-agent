import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Phone, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

const brandEase: [number, number, number, number] = [0.19, 1, 0.22, 1];

const BookingBar = () => {
  const { items, totalItems, totalPrice, sendToWhatsApp, removeItem, clearCart } = useCart();
  const [showCart, setShowCart] = useState(false);

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
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/60 z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.4, ease: brandEase }}
              className="fixed bottom-16 left-0 right-0 max-h-[60vh] bg-card border-t border-royal-red/30 z-50 overflow-y-auto rounded-t-2xl"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif italic text-xl font-light text-foreground">Your Order</h3>
                  <div className="flex items-center gap-3">
                    {items.length > 0 && (
                      <button onClick={clearCart} className="font-mono text-xs text-muted-foreground hover:text-destructive transition-colors">
                        Clear All
                      </button>
                    )}
                    <button onClick={() => setShowCart(false)}>
                      <X className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  </div>
                </div>

                {items.length === 0 ? (
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
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-serif italic text-sm text-foreground truncate">{item.name}</p>
                          <p className="font-mono text-xs text-muted-foreground">x{item.qty}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm text-accent tabular-nums">₹{item.price * item.qty}</span>
                          <button
                            onClick={() => removeItem(item.name)}
                            className="font-mono text-xs text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    <div className="border-t border-royal-red/30 pt-3 mt-2 flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Total</span>
                      <span className="font-mono text-lg text-accent tabular-nums">₹{totalPrice}</span>
                    </div>
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
              onClick={() => setShowCart(!showCart)}
              className="flex-1 bg-secondary text-foreground flex items-center justify-center gap-2 active:scale-[0.98] transition-transform duration-300 relative"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="font-mono text-sm font-medium tracking-tight uppercase">
                Cart ({totalItems})
              </span>
              <span className="font-mono text-xs text-accent ml-1">₹{totalPrice}</span>
            </button>
            <button
              onClick={sendToWhatsApp}
              className="flex-1 bg-[#25D366] text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-transform duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="font-mono text-sm font-medium tracking-tight uppercase">
                Order Now
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
