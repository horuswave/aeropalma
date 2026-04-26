"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "@/i18n";

export default function Stats() {
  const t = useTranslations("stats");
  const items = t.raw("items") as Array<{ value: string; suffix: string; label: string; desc: string }>;
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ position: "relative", padding: "120px 0", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1800&q=80&auto=format&fit=crop)`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,10,0.88)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(to right, transparent, #CE5605, #EA7628, transparent)" }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: "1280px", margin: "0 auto", padding: "0 40px" }}>
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <div className="section-label" style={{ justifyContent: "center", marginBottom: "20px" }}>{t("sectionLabel")}</div>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#FFFFFF", lineHeight: 1.1 }}>
            {t("title")}{" "}
            <span style={{ background: "linear-gradient(135deg, #CE5605, #EA7628)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {t("titleAccent")}
            </span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2px" }}>
          {items.map((s, i) => (
            <div key={s.label} style={{ textAlign: "center", padding: "48px 32px", background: i === 0 ? "rgba(206,86,5,0.15)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: `all 0.6s ease ${i * 0.1}s` }}>
              <div style={{ fontSize: "clamp(52px, 5vw, 80px)", fontWeight: 900, color: "#CE5605", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "4px" }}>
                {s.value}<span style={{ color: "#EA7628" }}>{s.suffix}</span>
              </div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>{s.label}</div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
