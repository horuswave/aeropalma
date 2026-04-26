"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "@/i18n";

const imageSrcs = [
  { src: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800&q=80&auto=format&fit=crop", wide: true },
  { src: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=600&q=80&auto=format&fit=crop", wide: false },
  { src: "https://images.unsplash.com/photo-1587019158091-1a103c5dd17f?w=600&q=80&auto=format&fit=crop", wide: false },
  { src: "https://images.unsplash.com/photo-1569535825082-71be65a7d7f6?w=600&q=80&auto=format&fit=crop", wide: false },
  { src: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80&auto=format&fit=crop", wide: true },
];

export default function Gallery() {
  const t = useTranslations("gallery");
  const labels = t.raw("items") as Array<{ label: string }>;
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.05 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="gallery" ref={ref} style={{ padding: "120px 0", background: "var(--bg)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 40px" }}>
        <div style={{ marginBottom: "64px" }}>
          <div className="section-label" style={{ marginBottom: "20px" }}>{t("sectionLabel")}</div>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--text-primary)" }}>
            {t("title")} <span className="text-gradient">{t("titleAccent")}</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {imageSrcs.map((img, i) => (
            <div key={i}
              style={{ gridColumn: img.wide ? "span 2" : "span 1", position: "relative", borderRadius: "8px", overflow: "hidden", aspectRatio: img.wide ? "16/7" : "4/3", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: `all 0.6s ease ${i * 0.08}s`, cursor: "pointer" }}
              onMouseEnter={(e) => { const el = e.currentTarget.querySelector("img") as HTMLImageElement; if (el) el.style.transform = "scale(1.04)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget.querySelector("img") as HTMLImageElement; if (el) el.style.transform = "scale(1)"; }}
            >
              <img src={img.src} alt={labels[i]?.label} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 50%)" }} />
              <div style={{ position: "absolute", bottom: "20px", left: "20px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "white" }}>
                {labels[i]?.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
