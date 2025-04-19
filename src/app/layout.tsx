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
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const pretendard = localFont({
    src: "../../public/fonts/PretendardVariable.woff2",
    variable: "--font-pretendard",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Traveling Dog",
    description: "AI-powered travel planner",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko-KR">
            <body className={`${geistSans.variable} ${geistMono.variable} ${pretendard.variable}`}>
                <CapacitorHandler />
                <div className={styles.main}>
                    <div className={styles.content}>{children}</div>
                    <BottomNavigation />
                </div>
            </body>
        </html>
    );
}
