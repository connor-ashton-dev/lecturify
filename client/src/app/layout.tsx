import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/custom/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    process.env.NODE_ENV === "production" ? "Lecturify" : "Lecturify (dev)",
  description: "Lecturify is a tool for creating and sharing lecture notes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="w-screen h-screen bg-[#FAF9F6]">
          {/* <body className="w-screen h-screen bg-gray-700"> */}
          {/* <body className="w-screen h-screen bg-gradient-to-b from-violet-400 via-indigo-500 to-blue-600"> */}
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
