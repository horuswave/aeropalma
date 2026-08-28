"use client";
import { useState } from "react";
import { X, Mail, Hand } from "lucide-react";

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const mailtoUrl =
    "mailto:info@aerpalma.aero?subject=Hello%20AeroPalma&body=Hello%20AeroPalma%2C%20I%20would%20like%20to%20inquire%20about%20your%20services.";

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
      {/* Popup bubble */}
      {isOpen && (
        <div className="bg-[#161616] border border-white/10 rounded-lg p-5 w-72 shadow-2xl shadow-black/50 animate-fadeUp">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
            <div className="w-10 h-10 bg-[#CE5605] rounded-full flex items-center justify-center flex-shrink-0">
              <Mail size={20} color="white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">AeroPalma</div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-[#CE5605] rounded-full" />
                <span className="text-white/40 text-xs">Online</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto text-white/30 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-3 mb-4">
            <p className="text-white/70 text-sm leading-relaxed">
              <span className="inline-flex items-center gap-1.5">
                <Hand size={14} className="inline" /> Hello! How can we help you today?
              </span>
              <br />
              <br />
              We&apos;re here to assist with Aviation Security, Ground Handling, and Hydro Maintenance services.
            </p>
            <div className="text-white/20 text-xs mt-2 text-right">Now</div>
          </div>
          <a
            href={mailtoUrl}
            className="flex items-center justify-center gap-2 w-full bg-[#CE5605] hover:bg-[#b94b04] text-white font-bold text-sm py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#CE5605]/30"
          >
            <Mail size={16} color="white" />
            Email Us
          </a>
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#CE5605] hover:bg-[#b94b04] rounded-full flex items-center justify-center shadow-xl shadow-[#CE5605]/40 hover:shadow-[#CE5605]/60 transition-all duration-300 hover:scale-110 relative"
        aria-label="Email AeroPalma"
      >
        {/* Ping animation */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-[#CE5605] animate-ping opacity-30" />
        )}
        <Mail
          size={28}
          color="white"
          className={`transition-transform duration-300 ${isOpen ? "scale-0 absolute" : "scale-100"}`}
        />
        <X
          size={24}
          color="white"
          className={`transition-transform duration-300 ${isOpen ? "scale-100" : "scale-0 absolute"}`}
        />
      </button>
    </div>
  );
}
