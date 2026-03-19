import { QRCodeSVG } from "qrcode.react";
import { useRef, useCallback } from "react";
import { Download, Printer } from "lucide-react";

const MENU_URL = "https://yum-list-weaver.lovable.app";

const FlyerPage = () => {
  const flyerRef = useRef<HTMLDivElement>(null);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <>
      {/* Print-only styles */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #flyer-printable, #flyer-printable * { visibility: visible !important; }
          #flyer-printable {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="min-h-screen bg-background flex flex-col items-center justify-start py-8 px-4">
        {/* Action buttons */}
        <div className="no-print flex gap-3 mb-6">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground rounded-lg font-mono text-xs uppercase tracking-widest hover:bg-accent/80 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Flyer
          </button>
          <a
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground rounded-lg font-mono text-xs uppercase tracking-widest hover:bg-secondary/80 transition-colors"
          >
            ← Back to Menu
          </a>
        </div>

        {/* Flyer */}
        <div
          id="flyer-printable"
          ref={flyerRef}
          className="w-full max-w-[420px] bg-[#0f0906] text-[#ece5d5] rounded-2xl overflow-hidden shadow-2xl"
          style={{ aspectRatio: "3/4" }}
        >
          {/* Top decorative border */}
          <div className="h-2 bg-gradient-to-r from-[#c9952b] via-[#e8c44a] to-[#c9952b]" />

          <div className="flex flex-col items-center justify-between h-[calc(100%-0.5rem)] px-8 py-8">
            {/* Header */}
            <div className="text-center">
              <p
                className="uppercase tracking-[0.35em] text-[#c9952b] mb-1"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.65rem", fontWeight: 500 }}
              >
                Family Restaurant · A/C
              </p>
              <h1
                className="italic leading-none"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2.2rem, 8vw, 3rem)",
                  fontWeight: 300,
                  color: "#ece5d5",
                }}
              >
                Brundavanam
              </h1>
              <div className="mt-3 flex items-center justify-center gap-3">
                <span className="block h-px w-10 bg-[#c9952b]/50" />
                <span
                  className="text-[#c9952b]"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.8rem" }}
                >
                  ✦
                </span>
                <span className="block h-px w-10 bg-[#c9952b]/50" />
              </div>
            </div>

            {/* QR Section */}
            <div className="flex flex-col items-center gap-4 my-6">
              <p
                className="uppercase tracking-[0.25em] text-center"
                style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "#8a7a6a" }}
              >
                Scan to view our menu & order
              </p>
              <div className="bg-white p-3.5 rounded-xl shadow-lg shadow-black/30">
                <QRCodeSVG
                  value={MENU_URL}
                  size={160}
                  bgColor="#ffffff"
                  fgColor="#0f0906"
                  level="H"
                />
              </div>
              <p
                className="text-center leading-relaxed"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "0.95rem",
                  fontStyle: "italic",
                  color: "#c9952b",
                }}
              >
                Browse the full menu.<br />
                Order directly on WhatsApp.
              </p>
            </div>

            {/* Contact & Location */}
            <div className="w-full">
              <div className="border-t border-[#c9952b]/30 pt-5 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <span
                    className="uppercase shrink-0"
                    style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "#8a7a6a", letterSpacing: "0.15em", paddingTop: "2px" }}
                  >
                    Call
                  </span>
                  <span
                    style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#ece5d5" }}
                  >
                    7075959303
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span
                    className="uppercase shrink-0"
                    style={{ fontFamily: "monospace", fontSize: "0.55rem", color: "#8a7a6a", letterSpacing: "0.15em", paddingTop: "2px" }}
                  >
                    Find
                  </span>
                  <span
                    className="leading-snug"
                    style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#ece5d5" }}
                  >
                    Nellore Road, Near Honda Showroom,<br />
                    Badvel, Kadapa District
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="no-print font-mono text-xs text-muted-foreground mt-4 text-center">
          Click "Print Flyer" to print or save as PDF
        </p>
      </div>
    </>
  );
};

export default FlyerPage;
