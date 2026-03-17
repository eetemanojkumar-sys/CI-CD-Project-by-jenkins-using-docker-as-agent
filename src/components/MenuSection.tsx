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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: brandEase as unknown as number[], delay: 0.05 }}
      className="border-t border-border py-8 grid grid-cols-1 md:grid-cols-12 gap-4"
    >
      <span className="md:col-span-4 font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 md:mb-0 md:pt-1">
        {category.label}
      </span>
      <div className="md:col-span-8 flex flex-col gap-6">
        {category.items.map((item, i) => (
          <div key={i} className="group cursor-default">
            <div className="flex justify-between items-baseline gap-4">
              <h3 className="text-lg md:text-xl font-serif italic font-light text-foreground group-hover:italic transition-all duration-500">
                {item.name}
              </h3>
              <span className="font-mono text-sm text-muted-foreground group-hover:text-accent transition-colors duration-500 tabular-nums whitespace-nowrap">
                ₹{item.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MenuSection;
