"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "@/i18n";
import { usePathname } from "next/navigation";

interface NavbarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

function LocaleToggle({
  currentLocale,
  switchLocale,
}: {
  currentLocale: string;
  switchLocale: (l: string) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "var(--card-bg)",
        borderRadius: "999px",
        padding: "4px",
        border: "1px solid var(--border)",
      }}
    >
      {(["en", "pt"] as const).map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          style={{
            border: "none",
            background:
              currentLocale === locale
                ? "linear-gradient(135deg, #CE5605, #E56A1A)"
                : "transparent",
            color: currentLocale === locale ? "#fff" : "var(--text-secondary)",
            padding: "6px 14px",
            fontSize: "12px",
            fontWeight: 600,
            borderRadius: "999px",
            cursor: "pointer",
            transition: "all 0.25s",
          }}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function ThemeToggle({
  theme,
  toggleTheme,
}: {
  theme: "light" | "dark";
  toggleTheme: () => void;
}) {
  return (
    <button
      onClick={toggleTheme}
      style={{
        width: "38px",
        height: "38px",
        borderRadius: "50%",
        border: "1px solid var(--border)",
        background: "var(--card-bg)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.25s",
        color: "var(--text-primary)",
        flexShrink: 0,
      }}
    >
      {theme === "light" ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const currentLocale = pathname.startsWith("/pt") ? "pt" : "en";
  const switchLocale = (locale: string) => {
    const newPath = pathname.replace(/^\/(en|pt)/, `/${locale}`);
    window.location.href = newPath;
  };

  const links = [
    { href: "#services", label: t("services") },
    { href: "#about", label: t("about") },
    { href: "#clients", label: t("clients") },
    { href: "#gallery", label: t("gallery") },
    { href: "#contact", label: t("contact") },
  ];

  const navBg = scrolled || menuOpen;

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop, .nav-right-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-hamburger { display: none !important; }
          .mobile-overlay, .mobile-drawer { display: none !important; }
        }
        .nav-link {
          color: var(--text-primary);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.25s;
        }
        .nav-link:hover { color: #CE5605; }
        .cta-link {
          padding: 10px 22px;
          font-size: 12px;
          background: linear-gradient(135deg, #CE5605, #E56A1A);
          color: white;
          border-radius: 40px;
          text-decoration: none;
          font-weight: 600;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 8px rgba(206,86,5,0.3);
          transition: all 0.3s;
        }
        .cta-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(206,86,5,0.4);
        }
        .drawer-link {
          display: block;
          color: var(--text-primary);
          text-decoration: none;
          font-size: 20px;
          font-weight: 600;
          padding: 16px 0;
          border-bottom: 1px solid var(--border);
          transition: color 0.2s, opacity 0.3s, transform 0.3s;
        }
        .drawer-link:hover { color: #CE5605; }
      `}</style>

      {/* Mobile overlay */}
      <div
        className="mobile-overlay"
        onClick={() => setMenuOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 98,
          background: "rgba(0,0,0,0.45)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Mobile drawer */}
      <div
        className="mobile-drawer"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(300px, 85vw)",
          zIndex: 99,
          background: "var(--nav-bg)",
          backdropFilter: "blur(20px)",
          borderLeft: "1px solid var(--border)",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          padding: "80px 28px 40px",
          overflowY: "auto",
        }}
      >
        {links.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            className="drawer-link"
            onClick={() => setMenuOpen(false)}
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateX(0)" : "translateX(20px)",
              transitionDelay: menuOpen ? `${i * 40 + 80}ms` : "0ms",
            }}
          >
            {l.label}
          </a>
        ))}

        <div
          style={{
            marginTop: "auto",
            paddingTop: "32px",
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? "translateY(0)" : "translateY(10px)",
            transition: `opacity 0.3s ${menuOpen ? "0.28s" : "0s"}, transform 0.3s ${menuOpen ? "0.28s" : "0s"}`,
          }}
        >
          <a
            href="#contact"
            className="cta-link"
            onClick={() => setMenuOpen(false)}
            style={{
              display: "block",
              textAlign: "center",
              padding: "14px 22px",
              fontSize: "14px",
            }}
          >
            {t("cta")}
          </a>
        </div>
      </div>

      {/* Navbar */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: navBg ? "10px 0" : "16px 0",
          backgroundColor: navBg ? "var(--nav-bg)" : "transparent",
          backdropFilter: navBg ? "blur(12px)" : "none",
          borderBottom: navBg ? "1px solid var(--border)" : "none",
          transition: "all 0.35s ease",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 clamp(16px, 4vw, 40px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <a
            href="#"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
            }}
          >
            <img
              src="/logo.svg"
              alt="AeroPalma Logo"
              style={{
                height: navBg ? "54px" : "66px",
                width: "auto",
                display: "block",
                transition: "all 0.35s ease",
              }}
            />
          </a>

          {/* Desktop links */}
          <div
            className="nav-links-desktop"
            style={{ display: "flex", alignItems: "center", gap: "36px" }}
          >
            {links.map((l) => (
              <a key={l.href} href={l.href} className="nav-link">
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop right controls */}
          <div
            className="nav-right-desktop"
            style={{ display: "flex", alignItems: "center", gap: "12px" }}
          >
            <LocaleToggle
              currentLocale={currentLocale}
              switchLocale={switchLocale}
            />
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <a href="#contact" className="cta-link">
              {t("cta")}
            </a>
          </div>

          {/* Mobile right: locale + theme + hamburger */}
          <div
            className="nav-hamburger"
            style={{ display: "none", alignItems: "center", gap: "8px" }}
          >
            <LocaleToggle
              currentLocale={currentLocale}
              switchLocale={switchLocale}
            />
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                background: "var(--card-bg)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                padding: 0,
              }}
            >
              <span
                style={{
                  display: "block",
                  width: "18px",
                  height: "2px",
                  background: "var(--text-primary)",
                  borderRadius: "2px",
                  transition: "all 0.3s ease",
                  transform: menuOpen
                    ? "translateY(7px) rotate(45deg)"
                    : "none",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "18px",
                  height: "2px",
                  background: "var(--text-primary)",
                  borderRadius: "2px",
                  transition: "all 0.3s ease",
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "18px",
                  height: "2px",
                  background: "var(--text-primary)",
                  borderRadius: "2px",
                  transition: "all 0.3s ease",
                  transform: menuOpen
                    ? "translateY(-7px) rotate(-45deg)"
                    : "none",
                }}
              />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
