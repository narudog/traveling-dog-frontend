import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.narudog.travelingdog",
  appName: "TravelingDog",
  webDir: "public",
  server: {
    url: "https://traveling-dev.narudog.com", // 네 컴퓨터의 IP 주소
    cleartext: true, // HTTP 허용
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#000000",
      androidSplashResourceName: "splash",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
