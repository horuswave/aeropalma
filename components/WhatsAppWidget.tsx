"use client";
import { useState } from "react";
import { X, Hand } from "lucide-react";

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappUrl =
    "https://wa.me/258851013008?text=Hello%20AeroPalma%2C%20I%20would%20like%20to%20inquire%20about%20your%20services.";

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
      {/* Popup bubble */}
      {isOpen && (
        <div className="bg-[#161616] border border-white/10 rounded-lg p-5 w-72 shadow-2xl shadow-black/50 animate-fadeUp">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
            <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M20.5 3.5A12 12 0 003.5 20.5L2 22l1.5-5.5A12 12 0 1020.5 3.5z" />
              </svg>
            </div>
            <div>
              <div className="text-white font-bold text-sm">AeroPalma</div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-[#25D366] rounded-full" />
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
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bf5a] text-white font-bold text-sm py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#25D366]/30"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M20.5 3.5A12 12 0 003.5 20.5L2 22l1.5-5.5A12 12 0 1020.5 3.5z" />
            </svg>
            Start Chat
          </a>
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20bf5a] rounded-full flex items-center justify-center shadow-xl shadow-[#25D366]/40 hover:shadow-[#25D366]/60 transition-all duration-300 hover:scale-110 relative"
        aria-label="Open WhatsApp chat"
      >
        {/* Ping animation */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        )}
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="white"
          className={`transition-transform duration-300 ${isOpen ? "scale-0 absolute" : "scale-100"}`}
        >
          <path d="M20.5 3.5A12 12 0 003.5 20.5L2 22l1.5-5.5A12 12 0 1020.5 3.5z" />
        </svg>
        <X
          size={24}
          color="white"
          className={`transition-transform duration-300 ${isOpen ? "scale-100" : "scale-0 absolute"}`}
        />
      </button>
    </div>
  );
}
