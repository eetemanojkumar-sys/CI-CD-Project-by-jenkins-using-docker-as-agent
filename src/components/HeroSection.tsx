import { motion } from "framer-motion";

const brandEase: [number, number, number, number] = [0.19, 1, 0.22, 1];

const HeroSection = () => {
  return (
    <section className="min-h-[80vh] flex flex-col justify-end px-6 md:px-16 pb-16 md:pb-24 relative">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: brandEase as unknown as number[] }}
      >
        <h1
          className="font-serif italic font-light text-foreground leading-[0.95]"
          style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
        >
          Brundavanam
        </h1>
        <div className="mt-6 flex flex-col md:flex-row md:items-end gap-4 md:gap-12">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground max-w-[40ch]">
            Family Restaurant · Veg & Non-Veg
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Nellore Road, Near Honda Showroom, Badvel, Kadapa District
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: brandEase as unknown as number[] }}
        className="absolute top-8 right-6 md:right-16"
      >
        <a
          href="tel:7075959303"
          className="font-mono text-xs text-muted-foreground hover:text-accent transition-colors duration-500"
        >
          7075959303
        </a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
