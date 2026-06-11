"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Clients from "@/components/Clients";
import Services from "@/components/Services";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsApp from "@/components/WhatsApp";
import Partners from "@/components/Partners";

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <main>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Hero />
      <Clients />
      <Services />
      <About />
      <Partners />
      <Stats />
      <Gallery />
      <Contact />
      <Footer />
      <WhatsApp />
    </main>
  );
}
