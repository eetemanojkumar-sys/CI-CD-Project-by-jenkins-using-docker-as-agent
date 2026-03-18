import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import MenuNav from "@/components/MenuNav";
import BookingBar from "@/components/BookingBar";
import { menuCategories } from "@/data/menuData";

const brandEase: [number, number, number, number] = [0.19, 1, 0.22, 1];

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20 scroll-smooth">
      <HeroSection />
      <MenuNav />

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: brandEase }}
        className="px-6 md:px-16 py-[10vh]"
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: brandEase }}
          className="font-serif italic font-light text-foreground mb-16"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          The Menu
        </motion.h2>

        <div className="flex flex-col">
          {menuCategories.map((category, index) => (
            <div key={index} id={`section-${index}`}>
              <MenuSection category={category} index={index} />
            </div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: brandEase }}
        className="border-t border-royal-red/30 px-6 md:px-16 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: brandEase }}
            className="md:col-span-4"
          >
            <h3 className="font-serif italic text-2xl font-light text-foreground">Brundavanam</h3>
            <p className="font-mono text-xs text-muted-foreground mt-2">Family Restaurant · A/C</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: brandEase }}
            className="md:col-span-4"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">Location</p>
            <p className="font-mono text-sm text-foreground">
              Nellore Road, Near Honda Showroom,<br />
              Badvel, Kadapa District
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: brandEase }}
            className="md:col-span-4"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">Contact</p>
            <a href="tel:7075959303" className="font-mono text-sm text-foreground hover:text-accent transition-colors duration-500 block">
              7075959303
            </a>
            <a
              href="https://wa.me/917075959303?text=Hi%20Brundavanam!"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-foreground hover:text-accent transition-colors duration-500 block mt-1"
            >
              WhatsApp Us
            </a>
          </motion.div>
        </div>
      </motion.footer>

      <BookingBar />
    </div>
  );
};

export default Index;
