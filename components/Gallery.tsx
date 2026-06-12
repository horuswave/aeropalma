"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "@/i18n";

const imageSrcs = [
  { src: "/images/b7hICDeeb4C7J1J5jApt.jpg" }, // Big
  { src: "/images/security.jpeg" },
  { src: "/images/177icd8i7d0AhHHfj6gn.jpg" },
  { src: "/images/bhhI2d8GccCj9lwI2Gai.jpg" },
  { src: "/images/sunset_105054187.jpg" },
];

export default function Gallery() {
  const t = useTranslations("gallery");
  const labels = t.raw("items") as Array<{ label: string }>;
  const [visible, setVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) =>
      e.key === "Escape" && setSelectedImage(null);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const openImage = (index: number) => setSelectedImage(index);

  return (
    <section
      id="gallery"
      ref={ref}
      style={{ padding: "clamp(60px, 10vw, 120px) 0", background: "var(--bg)" }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 clamp(20px, 5vw, 40px)",
        }}
      >
        <div style={{ marginBottom: "clamp(40px, 6vw, 64px)" }}>
          <div className="section-label" style={{ marginBottom: "20px" }}>
            {t("sectionLabel")}
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 56px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "var(--text-primary)",
            }}
          >
            {t("title")}{" "}
            <span className="text-gradient">{t("titleAccent")}</span>
          </h2>
        </div>

        {/* Optimized 5-Image Balanced Layout */}
        <div
          className="gallery-l-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "clamp(16px, 2.5vw, 24px)",
            maxWidth: "1180px",
            margin: "0 auto",
          }}
        >
          {/* Big Image - Left Side (Spans 4 of 6 columns) */}
          <div
            className="gallery-item big"
            style={{
              gridColumn: "1 / span 4",
              gridRow: "1 / span 2",
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden",
              cursor: "pointer",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(30px)",
              transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            onClick={() => openImage(0)}
            onMouseEnter={(e) => {
              const img = e.currentTarget.querySelector(
                "img",
              ) as HTMLImageElement;
              if (img) img.style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              const img = e.currentTarget.querySelector(
                "img",
              ) as HTMLImageElement;
              if (img) img.style.transform = "scale(1)";
            }}
          >
            <img
              src={imageSrcs[0].src}
              alt={labels[0]?.label || ""}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.6s ease",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "32px",
                left: "32px",
                fontSize: "15px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "white",
              }}
            >
              {labels[0]?.label}
            </div>
          </div>

          {/* Small 1 - Top Right */}
          <div
            className="gallery-item small-1"
            style={{
              gridColumn: "5 / span 2",
              gridRow: "1",
              position: "relative",
              borderRadius: "12px",
              overflow: "hidden",
              aspectRatio: "4/3",
              cursor: "pointer",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(30px)",
              transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s",
            }}
            onClick={() => openImage(1)}
            onMouseEnter={(e) => {
              const img = e.currentTarget.querySelector(
                "img",
              ) as HTMLImageElement;
              if (img) img.style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              const img = e.currentTarget.querySelector(
                "img",
              ) as HTMLImageElement;
              if (img) img.style.transform = "scale(1)";
            }}
          >
            <img
              src={imageSrcs[1].src}
              alt={labels[1]?.label || ""}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.6s ease",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "white",
              }}
            >
              {labels[1]?.label}
            </div>
          </div>

          {/* Small 2 - Middle Right */}
          <div
            className="gallery-item small-2"
            style={{
              gridColumn: "5 / span 2",
              gridRow: "2",
              position: "relative",
              borderRadius: "12px",
              overflow: "hidden",
              aspectRatio: "4/3",
              cursor: "pointer",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(30px)",
              transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s",
            }}
            onClick={() => openImage(2)}
            onMouseEnter={(e) => {
              const img = e.currentTarget.querySelector(
                "img",
              ) as HTMLImageElement;
              if (img) img.style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              const img = e.currentTarget.querySelector(
                "img",
              ) as HTMLImageElement;
              if (img) img.style.transform = "scale(1)";
            }}
          >
            <img
              src={imageSrcs[2].src}
              alt={labels[2]?.label || ""}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.6s ease",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "white",
              }}
            >
              {labels[2]?.label}
            </div>
          </div>

          {/* Small 3 - Bottom Left */}
          <div
            className="gallery-item small-3"
            style={{
              gridColumn: "1 / span 3",
              gridRow: "3",
              position: "relative",
              borderRadius: "12px",
              overflow: "hidden",
              height: "260px",
              cursor: "pointer",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(30px)",
              transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
            }}
            onClick={() => openImage(3)}
            onMouseEnter={(e) => {
              const img = e.currentTarget.querySelector(
                "img",
              ) as HTMLImageElement;
              if (img) img.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              const img = e.currentTarget.querySelector(
                "img",
              ) as HTMLImageElement;
              if (img) img.style.transform = "scale(1)";
            }}
          >
            <img
              src={imageSrcs[3].src}
              alt={labels[3]?.label || ""}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.6s ease",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "20px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "white",
              }}
            >
              {labels[3]?.label}
            </div>
          </div>

          {/* Small 4 - Bottom Right */}
          <div
            className="gallery-item small-4"
            style={{
              gridColumn: "4 / span 3",
              gridRow: "3",
              position: "relative",
              borderRadius: "12px",
              overflow: "hidden",
              height: "260px",
              cursor: "pointer",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(30px)",
              transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.4s",
            }}
            onClick={() => openImage(4)}
            onMouseEnter={(e) => {
              const img = e.currentTarget.querySelector(
                "img",
              ) as HTMLImageElement;
              if (img) img.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              const img = e.currentTarget.querySelector(
                "img",
              ) as HTMLImageElement;
              if (img) img.style.transform = "scale(1)";
            }}
          >
            <img
              src={imageSrcs[4].src}
              alt={labels[4]?.label || ""}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.6s ease",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "20px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "white",
              }}
            >
              {labels[4]?.label}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.96)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setSelectedImage(null)}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "95vw",
              maxHeight: "95vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageSrcs[selectedImage].src}
              alt={labels[selectedImage]?.label || ""}
              style={{
                maxWidth: "100%",
                maxHeight: "90vh",
                borderRadius: "16px",
                boxShadow: "0 30px 60px -15px rgb(0 0 0 / 0.6)",
              }}
            />
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position: "absolute",
                top: "-18px",
                right: "-18px",
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "#111",
                color: "#fff",
                border: "none",
                fontSize: "26px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Responsive Viewports for Tablet Screen Dimensions */
        @media (max-width: 1024px) {
          .gallery-l-layout {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .big {
            grid-column: 1 / span 2 !important;
            grid-row: 1 / span 2 !important;
          }
          .small-1 {
            grid-column: 1 !important;
            grid-row: 3 !important;
          }
          .small-2 {
            grid-column: 2 !important;
            grid-row: 3 !important;
          }
          .small-3,
          .small-4 {
            height: auto !important;
            aspect-ratio: 4/3 !important;
          }
          .small-3 {
            grid-column: 1 !important;
            grid-row: 4 !important;
          }
          .small-4 {
            grid-column: 2 !important;
            grid-row: 4 !important;
          }
        }

        /* Mobile Viewport Sizing rules */
        @media (max-width: 640px) {
          .gallery-l-layout {
            grid-template-columns: 1fr !important;
          }
          .big,
          .small-1,
          .small-2,
          .small-3,
          .small-4 {
            grid-column: 1 !important;
            grid-row: auto !important;
            height: auto !important;
            aspect-ratio: 4/3 !important;
          }
        }
      `}</style>
    </section>
  );
}
