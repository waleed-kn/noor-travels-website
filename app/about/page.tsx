import React from "react";
import { Container, SectionHeading } from "@/components/ui";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "About Us",
  description: "Learn more about Noor Travels, our mission, and our values.",
};

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          badge="Our Story"
          title={`About ${siteConfig.name}`}
          description="Serving pilgrims from Peshawar with honor, trust, and complete transparency."
        />
        <div className="mt-8 p-8 rounded-xl bg-white border border-border shadow-xs text-navy-deep/80 max-w-3xl mx-auto space-y-4">
          <p className="leading-relaxed">
            {siteConfig.name} is a licensed pilgrimage travel service agency based in Peshawar Saddar. We are devoted to easing every step of the pilgrimage for believers visiting Makkah al-Mukarramah and Madinah al-Munawwarah.
          </p>
          <p className="leading-relaxed">
            From visa processing to flights, hotel bookings close to the Haramain, and on-ground transport, our dedicated team handles every detail with dignity and care.
          </p>
        </div>
      </Container>
    </div>
  );
}
