"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "@/i18n";

export default function About() {
  const t = useTranslations("about");
  const badges = t.raw("badges") as Array<{ icon: string; title: string; desc: string }>;
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} style={{ padding: "clamp(60px, 10vw, 120px) 0", background: "var(--bg-secondary)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 clamp(20px, 5vw, 40px)" }}>
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px, 7vw, 100px)", alignItems: "center" }}>

          {/* Image stack */}
          <div className="about-image-stack" style={{ position: "relative", height: "560px" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: "80px", bottom: "80px", borderRadius: "8px", overflow: "hidden", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(-24px)", transition: "all 0.7s ease" }}>
              <img src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80&auto=format&fit=crop" alt="Airport operations" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ position: "absolute", bottom: 0, right: 0, width: "55%", height: "55%", borderRadius: "8px", overflow: "hidden", border: "6px solid var(--bg-secondary)", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(24px)", transition: "all 0.7s ease 0.2s" }}>
              <img src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80&auto=format&fit=crop" alt="Aviation team" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ position: "absolute", top: "40px", right: "40px", background: "#CE5605", borderRadius: "8px", padding: "16px 20px", textAlign: "center", opacity: visible ? 1 : 0, transition: "all 0.7s ease 0.4s", boxShadow: "0 8px 32px rgba(206,86,5,0.4)" }}>
              <div style={{ fontSize: "32px", fontWeight: 900, color: "white", lineHeight: 1 }}>MOZ</div>
              <div style={{ fontSize: "9px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.8)", textTransform: "uppercase", marginTop: "4px" }}>Mozambique</div>
            </div>
          </div>

          {/* Content */}
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: "all 0.7s ease 0.15s" }}>
            <div className="section-label" style={{ marginBottom: "24px" }}>{t("sectionLabel")}</div>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 52px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--text-primary)", marginBottom: "28px" }}>
              {t("title")} <span className="text-gradient">{t("titleAccent")}</span>
            </h2>
            <p style={{ fontSize: "clamp(14px, 1.5vw, 16px)", lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: "20px" }}>{t("body1")}</p>
            <p style={{ fontSize: "clamp(14px, 1.5vw, 16px)", lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: "40px" }}>{t("body2")}</p>

            <div className="about-badges" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "40px" }}>
              {badges.map((item) => (
                <div key={item.title} style={{ display: "flex", gap: "14px", alignItems: "flex-start", padding: "16px", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px" }}>
                  <span style={{ fontSize: "20px" }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>{item.title}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <a href="#contact" className="btn-orange">{t("cta")} →</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
          .about-image-stack {
            height: 300px !important;
            order: -1;
          }
        }
        @media (max-width: 480px) {
          .about-badges {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
