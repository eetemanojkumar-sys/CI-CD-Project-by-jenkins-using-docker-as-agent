import { motion } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";

const BookingBar = () => {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay: 1, ease: [0.19, 1, 0.22, 1] }}
      className="fixed bottom-0 left-0 right-0 h-16 flex z-50"
    >
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
    </motion.div>
  );
};

export default BookingBar;
