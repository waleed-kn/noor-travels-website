import React from "react";
import { Container, SectionHeading } from "@/components/ui";

export const metadata = {
  title: "Gallery",
  description: "Visual glimpses from sacred pilgrimages with Noor Travels.",
};

export default function GalleryPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          badge="Moments"
          title="Sacred Journeys Gallery"
          description="Photographs and memories from our pilgrim groups across Makkah, Madinah, and historical Ziyarat locations."
        />
        <div className="mt-8 p-12 rounded-xl bg-white border border-border shadow-xs text-center max-w-2xl mx-auto">
          <p className="text-navy-deep/80 leading-relaxed">
            Our updated photo gallery is being refreshed for the 2026 season. Stay tuned or contact us for hotel room photos and tour albums.
          </p>
        </div>
      </Container>
    </div>
  );
}
