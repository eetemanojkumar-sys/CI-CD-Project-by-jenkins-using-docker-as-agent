import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Minus } from "lucide-react";
import type { MenuCategory } from "@/data/menuData";
import { useCart } from "@/context/CartContext";

const brandEase: [number, number, number, number] = [0.19, 1, 0.22, 1];

interface MenuSectionProps {
  category: MenuCategory;
  index: number;
}

const MenuSection = ({ category, index }: MenuSectionProps) => {
  const [isOpen, setIsOpen] = useState(index === 0);
  const { addItem, removeItem, items } = useCart();

  const getQty = (name: string) => items.find((i) => i.name === name)?.qty || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: brandEase, delay: 0.05 }}
      className="border-t border-royal-red/30"
    >
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between group cursor-pointer"
      >
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground group-hover:text-accent transition-colors duration-300">
          {category.label}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: brandEase }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
        </motion.span>
      </button>

      {/* Accordion Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: brandEase }}
            className="overflow-hidden"
          >
            <div className="pb-6 flex flex-col gap-1">
              {category.items.map((item, i) => {
                const qty = getQty(item.name);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.03, ease: brandEase }}
                    className="group flex items-center justify-between gap-3 py-3 px-2 rounded hover:bg-secondary/40 transition-colors duration-300"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-lg font-serif italic font-light text-foreground truncate">
                        {item.name}
                      </h3>
                    </div>

                    <span className="font-mono text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                      ₹{item.price}
                    </span>

                    {/* Add/Remove Controls */}
                    <div className="flex items-center gap-1 ml-2">
                      {qty > 0 && (
                        <motion.button
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          onClick={() => removeItem(item.name)}
                          className="w-7 h-7 rounded-full border border-royal-red/40 flex items-center justify-center text-foreground hover:bg-secondary/60 transition-colors duration-200"
                        >
                          <Minus className="w-3 h-3" />
                        </motion.button>
                      )}
                      {qty > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="font-mono text-sm text-accent w-5 text-center tabular-nums"
                        >
                          {qty}
                        </motion.span>
                      )}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addItem(item.name, item.price)}
                        className="w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:brightness-110 transition-all duration-200"
                      >
                        <Plus className="w-3 h-3" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MenuSection;
