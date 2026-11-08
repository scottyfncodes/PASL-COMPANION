import type { Metadata, Viewport } from "next";
import AppShell from "@/components/AppShell";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

export const metadata: Metadata = {
  title: "PASL Companion",
  description: "A calm, private planner for the ETS Performance Assessment for School Leaders. Independent and not affiliated with ETS.",
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: "PASL", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#fbf8f2",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
