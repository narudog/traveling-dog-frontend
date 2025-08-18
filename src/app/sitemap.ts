import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  // 정적 경로 우선 등록. 필요시 서버 데이터로 확장 가능
  const routes: string[] = [
    "/",
    "/travel-plan/list",
    "/reviews/feed",
    "/today-activity/saved",
  ];

  return routes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: now,
    changeFrequency: "daily",
    priority: route === "/" ? 1 : 0.7,
  }));
}
