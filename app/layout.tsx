import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ramil Aoanan — Frontend Developer",
  description:
    "Portfolio of Ramil Aoanan — frontend developer creating modern, interactive and performant web experiences.",
  keywords: [
    "Ramil Aoanan",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "JavaScript Developer",
    "Web Developer",
  ],
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
