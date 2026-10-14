import React from "react";
import { Container, SectionHeading, Card } from "@/components/ui";
import { siteConfig } from "@/lib/site";
import { Phone, MapPin, Clock } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { InquiryForm } from "@/components/InquiryForm";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with Noor Travels in Peshawar Saddar.",
};

export default function ContactPage() {
  return (
    <div className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          badge="Get in Touch"
          title="Contact Noor Travels"
          description="We are here to answer your pilgrimage questions and help design your ideal Umrah journey."
        />

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <Card padding="md" className="bg-white">
              <h3 className="font-display text-xl font-bold text-navy mb-4">
                Office Information
              </h3>
              <div className="space-y-4 text-sm text-navy-deep/85">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-navy">Visit Our Office:</span>
                    <span>{siteConfig.address.full}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-navy">Phone & WhatsApp:</span>
                    {siteConfig.phones.map((p) => (
                      <a
                        key={p.raw}
                        href={`https://wa.me/${p.raw}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-navy hover:text-gold-dark transition-colors py-0.5"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366]" />
                        <span>{p.display}</span>
                        <span className="text-xs text-navy/60">({p.label})</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-navy">Office Hours:</span>
                    <span>{siteConfig.officeHours}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Inquiry Form */}
          <div className="lg:col-span-7">
            <InquiryForm
              title="Send an Inquiry"
              description="Fill out the form below and an Umrah advisor will respond promptly."
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
