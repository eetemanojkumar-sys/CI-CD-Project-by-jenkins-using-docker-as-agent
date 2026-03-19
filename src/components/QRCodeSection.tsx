import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Download, Share2 } from "lucide-react";
import { useCallback, useRef } from "react";

const brandEase: [number, number, number, number] = [0.19, 1, 0.22, 1];
const MENU_URL = "https://yum-list-weaver.lovable.app";

const QRCodeSection = () => {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(() => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      if (ctx) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, 512, 512);
        ctx.drawImage(img, 0, 0, 512, 512);
      }
      const link = document.createElement("a");
      link.download = "brundavanam-menu-qr.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  }, []);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Brundavanam Menu",
        text: "Scan this QR code to view our menu and order on WhatsApp!",
        url: MENU_URL,
      });
    } else {
      await navigator.clipboard.writeText(MENU_URL);
      alert("Menu link copied to clipboard!");
    }
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: brandEase }}
      className="px-6 md:px-16 py-16 border-t border-royal-red/30"
    >
      <div className="flex flex-col items-center text-center gap-6">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: brandEase }}
          className="font-serif italic text-2xl font-light text-foreground"
        >
          Scan to View Menu
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: brandEase }}
          className="font-mono text-xs text-muted-foreground max-w-xs"
        >
          Share this QR code with customers — they scan, browse the menu, and order directly on WhatsApp.
        </motion.p>

        <motion.div
          ref={qrRef}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: brandEase }}
          className="bg-white p-4 rounded-xl shadow-lg"
        >
          <QRCodeSVG
            value={MENU_URL}
            size={200}
            bgColor="#ffffff"
            fgColor="#0f0906"
            level="H"
          />
        </motion.div>

        <div className="flex gap-3 mt-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-mono text-xs uppercase tracking-widest hover:bg-secondary/80 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-mono text-xs uppercase tracking-widest hover:bg-accent/80 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

export default QRCodeSection;
