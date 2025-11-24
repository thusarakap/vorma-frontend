import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vorma - Gait Analysis",
  description: "Upload and analyze gait videos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
