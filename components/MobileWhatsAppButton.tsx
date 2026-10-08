import React from "react";
import { siteConfig } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons";

export function MobileWhatsAppButton() {
  const whatsappUrl = buildWhatsAppLink(siteConfig.defaultWhatsAppMessage);

  return (
    <aside
      aria-label="Direct WhatsApp Support"
      className="fixed bottom-0 inset-x-0 z-40 p-3 bg-white/95 backdrop-blur-md border-t border-border shadow-[0_-4px_16px_rgba(0,0,0,0.08)] md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className="max-w-md mx-auto">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full py-3 px-5 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-[#0A2250] font-bold text-sm tracking-wide shadow-md transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
          aria-label="Chat directly on WhatsApp with Noor Travels"
        >
          <WhatsAppIcon className="w-5 h-5 fill-[#0A2250]" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>
    </aside>
  );
}
