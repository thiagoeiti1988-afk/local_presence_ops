import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Local Presence Ops",
  description: "Auditoria e gestão operacional de Google Business Profiles.",
};

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/locations", label: "Locations" },
  { href: "/dashboard/reviews", label: "Reviews" },
  { href: "/dashboard/posts", label: "Posts" },
  { href: "/dashboard/audits", label: "Audits" },
  { href: "/dashboard/performance", label: "Performance" },
  { href: "/audit", label: "Public Audit Form" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <nav className="topnav">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
