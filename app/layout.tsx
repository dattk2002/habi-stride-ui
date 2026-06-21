import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { GoogleProvider } from "@/components/auth/google-provider";

const quicksand = Quicksand({ subsets: ["latin", "vietnamese"], variable: "--font-quicksand", display: "swap" });

export const metadata: Metadata = { title: "HabiStride — Tiến từng bước", description: "Theo dõi thói quen, duy trì chuỗi ngày và nuôi cây tiến bộ." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi" className={quicksand.variable}><body><GoogleProvider>{children}</GoogleProvider></body></html>;
}
