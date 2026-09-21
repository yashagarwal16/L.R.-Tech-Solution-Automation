import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://lrtechsolutions.com"),
  title: {
    default: "L. R. Tech Solutions | IT Services & Technology Consulting",
    template: "%s | L. R. Tech Solutions",
  },
  description:
    "L. R. Tech Solutions helps growing businesses with IT strategy, cloud infrastructure, cybersecurity, custom software, automation, and technology consulting.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "L. R. Tech Solutions",
    title: "L. R. Tech Solutions | IT Services & Technology Consulting",
    description: "Clearer systems, stronger security, and dependable growth for ambitious businesses.",
    url: "/",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "L. R. Tech Solutions | IT Services & Technology Consulting",
    description: "Technology, software, cloud, and cybersecurity consulting made from trust.",
  },
  keywords: ["IT services Jaipur", "technology consulting India", "cybersecurity consulting", "cloud infrastructure", "custom software development", "business automation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "L. R. Tech Solutions",
          url: process.env.NEXT_PUBLIC_SITE_URL || "https://lrtechsolutions.com",
          logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://lrtechsolutions.com"}/company-logo.jpg`,
          description: "IT services and technology consulting for businesses that want clearer systems, stronger security, and dependable growth.",
          address: { "@type": "PostalAddress", streetAddress: "Alankar Plaza, Sector 2, Central Spine", addressLocality: "Vidyadhar Nagar", addressRegion: "Rajasthan", postalCode: "302013", addressCountry: "IN" },
          areaServed: ["India", "Global"],
          sameAs: ["https://www.linkedin.com/company/lr-tech-solutions/"],
          knowsAbout: ["IT strategy", "Cloud infrastructure", "Cybersecurity", "Custom software", "Business automation"],
        }) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
