import "@/styles/mixins.scss";
import "@/styles/reset.scss"; // Reset styles
import "@/styles/variables.scss";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import styles from "./layout.module.scss";
import localFont from "next/font/local";
import BottomNavigation from "@/components/commons/BottomNavigation";
import Header from "@/components/commons/Header";
import CapacitorHandler from "@/app/capacitor-handler";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Traveling Dog",
  description: "AI-powered travel planner",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko-KR">
      <body className={`${pretendard.variable}`}>
        <CapacitorHandler />
        <div className={styles.main}>
          <div className={styles.content}>{children}</div>
          <BottomNavigation />
        </div>
      </body>
    </html>
  );
}
