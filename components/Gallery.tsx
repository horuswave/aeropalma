"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "@/i18n";

const imageSrcs = [
  { src: "/images/b7hICDeeb4C7J1J5jApt.jpg", wide: true },
  { src: "/images/177i23Ef13aD0CxU6d8v.jpg", wide: false },
  { src: "/images/177icd8i7d0AhHHfj6gn.jpg", wide: false },
  { src: "/images/bhhI2d8GccCj9lwI2Gai.jpg", wide: false },
  { src: "/images/sunset_105054187.jpg", wide: true },
];

export default function Gallery() {
  const t = useTranslations("gallery");
  const labels = t.raw("items") as Array<{ label: string }>;
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.05 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

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

        <div
          className="gallery-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(8px, 1.5vw, 16px)",
          }}
        >
          {imageSrcs.map((img, i) => (
            <div
              key={i}
              className={"gallery-item" + (img.wide ? " gallery-wide" : "")}
              style={{
                gridColumn: img.wide ? "span 2" : "span 1",
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                aspectRatio: img.wide ? "16/7" : "4/3",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(24px)",
                transition: "all 0.6s ease " + i * 0.08 + "s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget.querySelector(
                  "img",
                ) as HTMLImageElement;
                if (el) el.style.transform = "scale(1.04)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget.querySelector(
                  "img",
                ) as HTMLImageElement;
                if (el) el.style.transform = "scale(1)";
              }}
            >
              <img
                src={img.src}
                alt={labels[i]?.label}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.5s ease",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 50%)",
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
                {labels[i]?.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .gallery-grid {
            grid-template-columns: 1fr !important;
          }
          .gallery-wide {
            grid-column: span 1 !important;
            aspect-ratio: 16/9 !important;
          }
        }
      `}</style>
    </section>
  );
}
