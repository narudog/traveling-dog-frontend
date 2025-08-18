"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/auth";

export default function SocialCallbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const auth = useAuthStore();

  useEffect(() => {
    const handleSocialLogin = async () => {
      if (status === "loading") {
        console.log("세션 로딩 중...");
        return;
      }

      if (status === "authenticated" && session) {
        try {
          console.log("세션 데이터:", session);
          const googleIdToken = (session as any)?.googleIdToken;
          const provider = (session as any)?.provider;

          if (googleIdToken && provider === "google") {
            console.log("Google ID 토큰 발견, 백엔드 API 호출 시작");
            // 백엔드 API로 소셜 로그인 요청
            await auth.socialLogin("google", googleIdToken);
            console.log("소셜 로그인 성공, 원래 페이지로 이동:", returnUrl);
            router.push(returnUrl);
          } else {
            console.error("Google ID 토큰을 찾을 수 없습니다:", {
              googleIdToken,
              provider,
            });
            router.push("/login?error=no_token");
          }
        } catch (error) {
          console.error("소셜 로그인 실패:", error);
          router.push("/login?error=social_login_failed");
        }
      } else if (status === "unauthenticated") {
        console.log("인증되지 않은 상태, 로그인 페이지로 이동");
        router.push("/login?error=auth_failed");
      }
    };

    // 약간의 지연을 두어 세션 업데이트를 기다림
    const timer = setTimeout(handleSocialLogin, 500);
    return () => clearTimeout(timer);
  }, [session, status, router, auth]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div>소셜 로그인 처리 중...</div>
      <div
        style={{
          width: "20px",
          height: "20px",
          border: "2px solid #f3f3f3",
          borderTop: "2px solid #3498db",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
