import { motion } from "framer-motion";
import { menuCategories } from "@/data/menuData";

const brandEase: [number, number, number, number] = [0.19, 1, 0.22, 1];

const MenuNav = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: brandEase }}
      className="px-6 md:px-16 py-8 border-t border-royal-red/30 overflow-x-auto"
    >
      <div className="flex gap-6 min-w-max">
        {menuCategories.map((cat, i) => (
          <motion.a
            key={i}
            href={`#section-${i}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: brandEase }}
            whileHover={{ scale: 1.05 }}
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors duration-500 whitespace-nowrap"
          >
            {cat.label}
          </motion.a>
        ))}
      </div>
    </motion.nav>
  );
};

export default MenuNav;
