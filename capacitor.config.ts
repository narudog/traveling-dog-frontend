import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.frontend",
  appName: "frontend",
  webDir: "public",
  server: {
    url: "https://traveling-dev.narudog.com", // 네 컴퓨터의 IP 주소
    cleartext: true, // HTTP 허용
  },
};

export default config;
