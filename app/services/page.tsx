import React from "react";
import { Container, SectionHeading } from "@/components/ui";

export const metadata = {
  title: "Services",
  description: "Comprehensive Umrah and travel services by Noor Travels.",
};

export default function ServicesPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          badge="What We Provide"
          title="Our Pilgrimage & Travel Services"
          description="End-to-end support crafted for your peace of mind and comfort."
        />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-xl bg-white border border-border shadow-xs">
            <h3 className="font-display text-lg font-bold text-navy mb-2">Visa Processing</h3>
            <p className="text-sm text-navy-deep/75">Fast and accurate electronic Umrah visa filing and validation.</p>
          </div>
          <div className="p-6 rounded-xl bg-white border border-border shadow-xs">
            <h3 className="font-display text-lg font-bold text-navy mb-2">Hotels near Haram</h3>
            <p className="text-sm text-navy-deep/75">Verified hotel accommodations in both Makkah and Madinah with shuttle services.</p>
          </div>
          <div className="p-6 rounded-xl bg-white border border-border shadow-xs">
            <h3 className="font-display text-lg font-bold text-navy mb-2">Flight & Transport</h3>
            <p className="text-sm text-navy-deep/75">Direct and convenient connecting flights with air-conditioned ground transfers.</p>
          </div>
        </div>
      </Container>
    </div>
  );
}
