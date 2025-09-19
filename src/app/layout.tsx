import "@/styles/mixins.scss";
import "@/styles/reset.scss"; // Reset styles
import "@/styles/variables.scss";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import styles from "./layout.module.scss";
import localFont from "next/font/local";
import Header from "@/components/commons/Header";
import SessionProvider from "@/components/providers/SessionProvider";
import { siteConfig, absoluteUrl } from "@/lib/seo";
import TaskStatusBadge from "@/components/commons/TaskStatusBadge";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: "%s | Traveling",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "여행 플래너",
    "AI 여행",
    "여행 계획",
    "Trip",
    "Trip Planner",
    "Trip Planner AI",
  ],
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: "ko_KR",
    images: [
      {
        url: absoluteUrl("/logo.webp"),
        width: 1200,
        height: 630,
        alt: "Traveling",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: siteConfig.social.twitter,
    images: [absoluteUrl("/logo.webp")],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <html lang="ko-KR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${pretendard.variable}`}>
        <SessionProvider>
          <div className={styles.main}>
            <Header />
            <div className={styles.content}>{children}</div>
            <TaskStatusBadge />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
