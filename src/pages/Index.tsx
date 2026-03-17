import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import MenuNav from "@/components/MenuNav";
import BookingBar from "@/components/BookingBar";
import { menuCategories } from "@/data/menuData";

const brandEase = [0.19, 1, 0.22, 1] as const;

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <HeroSection />
      <MenuNav />

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: brandEase as unknown as number[] }}
        className="px-6 md:px-16 py-[10vh]"
      >
        <h2
          className="font-serif italic font-light text-foreground mb-16"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          The Menu
        </h2>

        <div className="flex flex-col">
          {menuCategories.map((category, index) => (
            <div key={index} id={`section-${index}`}>
              <MenuSection category={category} index={index} />
            </div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-border px-6 md:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <h3 className="font-serif italic text-2xl font-light text-foreground">Brundavanam</h3>
            <p className="font-mono text-xs text-muted-foreground mt-2">Family Restaurant · A/C</p>
          </div>
          <div className="md:col-span-4">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">Location</p>
            <p className="font-mono text-sm text-foreground">
              Nellore Road, Near Honda Showroom,<br />
              Badvel, Kadapa District
            </p>
          </div>
          <div className="md:col-span-4">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">Contact</p>
            <a href="tel:7075959303" className="font-mono text-sm text-foreground hover:text-accent transition-colors duration-500">
              7075959303
            </a>
          </div>
        </div>
      </footer>

      <BookingBar />
    </div>
  );
};

export default Index;
