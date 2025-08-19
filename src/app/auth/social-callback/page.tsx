"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/auth";

function SocialCallbackContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const auth = useAuthStore();

  useEffect(() => {
    const handleSocialLogin = async () => {
      if (status === "loading") {
        return;
      }

      if (status === "authenticated" && session) {
        try {
          const googleIdToken = (session as any)?.googleIdToken;
          const provider = (session as any)?.provider;

          if (googleIdToken && provider === "google") {
            await auth.socialLogin("google", googleIdToken);
            router.push(returnUrl);
          } else {
            router.push("/login?error=no_token");
          }
        } catch (_) {
          router.push("/login?error=social_login_failed");
        }
      } else if (status === "unauthenticated") {
        router.push("/login?error=auth_failed");
      }
    };

    const timer = setTimeout(handleSocialLogin, 500);
    return () => clearTimeout(timer);
  }, [session, status, router, auth, returnUrl]);

  return null;
}

export default function SocialCallbackPage() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <SocialCallbackContent />
    </Suspense>
  );
}
