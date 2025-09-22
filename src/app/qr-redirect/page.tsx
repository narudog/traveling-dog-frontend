"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

const ANDROID_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.narudog.traveling_dog_app";
// iOS 스토어 URL이 확정되면 아래 상수를 채워주세요.
const IOS_STORE_URL = ""; // e.g. https://apps.apple.com/app/idXXXXXXXXX

const QrRedirectPage = () => {
  const searchParams = useSearchParams();
  const [fallbackReady, setFallbackReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const taskId = useMemo(() => searchParams.get("taskId"), [searchParams]);

  const schemeUrl = useMemo(() => {
    if (!taskId) return "";
    return `travelingdog://home?taskId=${encodeURIComponent(taskId)}`;
  }, [taskId]);

  const isAndroid = useMemo(
    () =>
      typeof navigator !== "undefined" &&
      /android/i.test(navigator.userAgent || navigator.vendor),
    []
  );
  const isIOS = useMemo(
    () =>
      typeof navigator !== "undefined" &&
      /iPhone|iPad|iPod/i.test(navigator.userAgent || navigator.vendor),
    []
  );

  const tryOpenApp = useCallback(() => {
    if (!schemeUrl) return;
    // 앱 열기 시도
    const start = Date.now();
    // 페이지 가시성 변화를 이용하여 성공 추정
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        if (timerRef.current) window.clearTimeout(timerRef.current);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility, {
      once: true,
    });

    // 이동 시도
    window.location.href = schemeUrl;

    // 폴백: 일정 시간 안에 포커스가 사라지지 않으면 스토어 이동 버튼 노출
    timerRef.current = window.setTimeout(() => {
      setFallbackReady(true);
      // 자동 스토어 이동(특히 안드로이드)은 사용자 거부감을 줄이기 위해 수동 버튼 노출로 제한
    }, 1600);

    // 안전장치: 6초 뒤 이벤트 리스너 정리
    window.setTimeout(() => {
      document.removeEventListener("visibilitychange", handleVisibility);
    }, 6000);
  }, [schemeUrl]);

  useEffect(() => {
    if (!taskId) {
      setError("유효하지 않은 접근입니다. taskId가 필요합니다.");
      return;
    }
    tryOpenApp();
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [taskId, tryOpenApp]);

  const openStore = useCallback(() => {
    if (isAndroid) {
      window.location.href = ANDROID_STORE_URL;
    } else if (isIOS && IOS_STORE_URL) {
      window.location.href = IOS_STORE_URL;
    }
  }, [isAndroid, isIOS]);

  const openAppManually = useCallback(() => {
    if (!schemeUrl) return;
    window.location.href = schemeUrl;
  }, [schemeUrl]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("링크가 복사되었습니다.");
    } catch (e) {
      setError("링크 복사에 실패했습니다.");
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        gap: 12,
        padding: 16,
        textAlign: "center",
      }}
    >
      <h1 style={{ marginBottom: 8 }}>앱을 여는 중...</h1>
      <p style={{ color: "#6b7280" }}>
        잠시만 기다려주세요. 앱이 설치되어 있지 않으면 아래 버튼으로 스토어로
        이동할 수 있어요.
      </p>
      {error && <p style={{ color: "#ef4444" }}>{error}</p>}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={openAppManually}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: "#111827",
            color: "#fff",
          }}
        >
          앱으로 다시 열기
        </button>
        <button
          onClick={copyLink}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: "#ffffff",
            color: "#111827",
          }}
        >
          링크 복사
        </button>
        {fallbackReady && (
          <button
            onClick={openStore}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background:
                isAndroid || (isIOS && IOS_STORE_URL) ? "#10b981" : "#9ca3af",
              color: "#fff",
              cursor:
                isAndroid || (isIOS && IOS_STORE_URL)
                  ? "pointer"
                  : "not-allowed",
            }}
            disabled={!(isAndroid || (isIOS && IOS_STORE_URL))}
          >
            스토어로 이동
          </button>
        )}
      </div>
    </div>
  );
};

export default QrRedirectPage;
