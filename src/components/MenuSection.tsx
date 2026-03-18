import { motion } from "framer-motion";
import type { MenuCategory } from "@/data/menuData";

const brandEase: [number, number, number, number] = [0.19, 1, 0.22, 1];

interface MenuSectionProps {
  category: MenuCategory;
  index: number;
}

const MenuSection = ({ category, index }: MenuSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: brandEase, delay: 0.05 }}
      className="border-t border-royal-red/30 py-8 grid grid-cols-1 md:grid-cols-12 gap-4"
    >
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1, ease: brandEase }}
        className="md:col-span-4 font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 md:mb-0 md:pt-1"
      >
        {category.label}
      </motion.span>
      <div className="md:col-span-8 flex flex-col gap-6">
        {category.items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: brandEase }}
            className="group cursor-default"
          >
            <motion.div
              whileHover={{ x: 4 }}
              transition={{ duration: 0.3 }}
              className="flex justify-between items-baseline gap-4"
            >
              <h3 className="text-lg md:text-xl font-serif italic font-light text-foreground group-hover:italic transition-all duration-500">
                {item.name}
              </h3>
              <span className="font-mono text-sm text-muted-foreground group-hover:text-accent transition-colors duration-500 tabular-nums whitespace-nowrap">
                ₹{item.price}
              </span>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MenuSection;
