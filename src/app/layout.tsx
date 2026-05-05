import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Digital OMS", description: "Office and Order Management System for Digital Solution Pvt. Ltd." };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
