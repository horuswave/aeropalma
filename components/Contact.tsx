"use client";
import { useState } from "react";
import { useTranslations } from "@/i18n";
import { Phone, MapPin, Plane } from "lucide-react";

export default function Contact() {
  const t = useTranslations("contact");
  const serviceOptions = t.raw("serviceOptions") as string[];
  const [form, setForm] = useState({ name: "", company: "", email: "", service: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = "Hello AeroPalma,\n\nName: " + form.name + "\nCompany: " + form.company + "\nEmail: " + form.email + "\nService: " + form.service + "\n\nMessage: " + form.message;
    window.open("https://wa.me/258851013008?text=" + encodeURIComponent(msg), "_blank");
    setSent(true);
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
    { icon: <Phone size={20} color="#CE5605" />, label: t("whatsappLabel"), value: "+258 851 013 008", href: "https://wa.me/258851013008" },
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
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
