import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const brandEase: [number, number, number, number] = [0.19, 1, 0.22, 1];

const HeroSection = () => {
  return (
    <section className="min-h-[85vh] flex flex-col justify-end px-6 md:px-16 pb-16 md:pb-24 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Brundavanam restaurant food spread"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: brandEase }}
        className="relative z-10"
      >
        <h1
          className="font-serif italic font-light text-foreground leading-[0.95] drop-shadow-lg"
          style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
        >
          Brundavanam
        </h1>
        <div className="mt-6 flex flex-col md:flex-row md:items-end gap-4 md:gap-12">
          <p className="font-mono text-xs uppercase tracking-widest text-foreground/70 max-w-[40ch]">
            Family Restaurant · Veg & Non-Veg
          </p>
          <p className="font-mono text-xs text-foreground/60">
            Nellore Road, Near Honda Showroom, Badvel, Kadapa District
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: brandEase }}
        className="absolute top-8 right-6 md:right-16 z-10"
      >
        <a
          href="tel:7075959303"
          className="font-mono text-xs text-foreground/70 hover:text-accent transition-colors duration-500"
        >
          7075959303
        </a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
