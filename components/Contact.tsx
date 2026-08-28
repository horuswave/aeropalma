"use client";
import { useState } from "react";
import { useTranslations } from "@/i18n";
import { Mail, MapPin, Plane } from "lucide-react";

export default function Contact() {
  const t = useTranslations("contact");
  const serviceOptions = t.raw("serviceOptions") as string[];
  const [form, setForm] = useState({ name: "", company: "", email: "", service: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) throw new Error("Failed");

    setSent(true);
  } catch (err) {
    console.error(err);
    alert("Failed to send message");
  }
};
  const field: React.CSSProperties = {
    width: "100%", background: "var(--card-bg)", border: "1px solid var(--border)",
    borderRadius: "4px", padding: "14px 18px", fontSize: "14px",
    color: "var(--text-primary)", outline: "none",
    fontFamily: "'Lato', sans-serif", transition: "border-color 0.2s ease",
    boxSizing: "border-box",
  };
  const lbl: React.CSSProperties = {
    fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em",
    textTransform: "uppercase", color: "var(--text-secondary)",
    display: "block", marginBottom: "8px",
  };

  const contactItems = [
    { icon: <Mail size={20} color="#CE5605" />, label: t("whatsappLabel"), value: "info@aerpalma.aero", href: "mailto:info@aerpalma.aero" },
    { icon: <MapPin size={20} color="#CE5605" />, label: t("locationLabel"), value: t("locationValue"), href: "#" },
  ];

  return (
    <section id="contact" style={{ padding: "clamp(60px, 10vw, 120px) 0", background: "var(--bg-secondary)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 clamp(20px, 5vw, 40px)" }}>
        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px, 7vw, 100px)", alignItems: "flex-start" }}>

          {/* Info side */}
          <div>
            <div className="section-label" style={{ marginBottom: "24px" }}>{t("sectionLabel")}</div>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 52px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--text-primary)", marginBottom: "24px" }}>
              {t("title")} <span className="text-gradient">{t("titleAccent")}</span>
            </h2>
            <p style={{ fontSize: "clamp(14px, 1.5vw, 16px)", lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: "48px" }}>
              {t("description")}
            </p>

            {contactItems.map((c) => (
              <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined}
                style={{ display: "flex", alignItems: "center", gap: "20px", padding: "20px 24px", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", marginBottom: "12px", textDecoration: "none", transition: "all 0.25s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(206,86,5,0.4)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(206,86,5,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {c.icon}
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-secondary)" }}>{c.label}</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginTop: "2px" }}>{c.value}</div>
                </div>
              </a>
            ))}
          </div>

          {/* Form */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "clamp(24px, 4vw, 48px)" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                  <Plane size={48} color="#CE5605" />
                </div>
                <h3 style={{ fontSize: "24px", fontWeight: 900, color: "#CE5605", marginBottom: "12px" }}>{t("successTitle")}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>{t("successBody")}</p>
                <button onClick={() => setSent(false)} className="btn-orange" style={{ marginTop: "24px" }}>{t("successBtn")}</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize: "22px", fontWeight: 900, color: "var(--text-primary)", marginBottom: "32px" }}>{t("formTitle")}</h3>
                <div className="form-name-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div><label style={lbl}>{t("fieldName")} *</label><input name="name" required value={form.name} onChange={handleChange} placeholder={t("placeholderName")} style={field} /></div>
                  <div><label style={lbl}>{t("fieldCompany")}</label><input name="company" value={form.company} onChange={handleChange} placeholder={t("placeholderCompany")} style={field} /></div>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={lbl}>{t("fieldEmail")} *</label>
                  <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder={t("placeholderEmail")} style={field} />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={lbl}>{t("fieldService")}</label>
                  <select name="service" value={form.service} onChange={handleChange} style={field}>
                    <option value="">{t("placeholderService")}</option>
                    {serviceOptions.map((opt) => <option key={opt}>{opt}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: "32px" }}>
                  <label style={lbl}>{t("fieldMessage")} *</label>
                  <textarea name="message" required value={form.message} onChange={handleChange} placeholder={t("placeholderMessage")} rows={5} style={{ ...field, resize: "vertical" }} />
                </div>
                <button type="submit" className="btn-orange" style={{ width: "100%", justifyContent: "center" }}>
                  {t("submitBtn")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        input:focus, textarea:focus, select:focus { border-color: #CE5605 !important; }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .form-name-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
