import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "../components/Sidebar";

export const metadata: Metadata = {
  title: "Local Presence Ops",
  description: "Auditoria e gestão operacional de Google Business Profiles.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="app-shell">
          <Sidebar />
          <main className="app-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
