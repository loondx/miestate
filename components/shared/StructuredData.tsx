import { SITE, CONTACT, CONSULTANT, CORRIDORS } from "@/lib/config";

/**
 * Local-SEO structured data (JSON-LD). A RealEstateAgent graph tells Google
 * exactly who we are, where we operate (Bangalore corridors) and what we do
 * (buy / rent / resale / investment), which powers the local pack, the
 * knowledge panel and rich results.
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    image: `${SITE.url}/logo.jpeg`,
    logo: `${SITE.url}/logo.jpeg`,
    telephone: CONTACT.phoneDisplay,
    email: CONTACT.email,
    priceRange: "₹₹₹",
    currenciesAccepted: "INR",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sarjapura",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      postalCode: "562125",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 12.8606,
      longitude: 77.7866,
    },
    areaServed: ["Bengaluru", "Bangalore", ...CORRIDORS].map((name) => ({
      "@type": "Place",
      name,
    })),
    knowsAbout: [
      "Buying property in Bangalore",
      "Renting flats in Bangalore",
      "Resale property in Bangalore",
      "Real estate investment advisory",
      "RERA verification",
      "Home loan assistance",
    ],
    makesOffer: [
      "Buy verified property in Bangalore",
      "Rent apartments in Bangalore",
      "Resale property advisory in Bangalore",
      "Investment advisory",
    ].map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name, areaServed: "Bengaluru" },
    })),
    employee: {
      "@type": "Person",
      name: CONSULTANT.name,
      jobTitle: CONSULTANT.role,
      telephone: CONTACT.phoneDisplay,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "20:00",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
