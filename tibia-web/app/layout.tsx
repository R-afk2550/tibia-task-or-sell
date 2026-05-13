import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tibia Task or Sell",
  description:
    "Compare NPC value, Market value, and Delivery Task XP to decide what to do with your items.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}