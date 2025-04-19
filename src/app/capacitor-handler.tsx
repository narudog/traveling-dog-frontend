"use client";

import { useEffect } from "react";
import { App } from "@capacitor/app";

export default function CapacitorHandler() {
    useEffect(() => {
        // Capacitor App 플러그인 백버튼 핸들러 등록
        const setupBackButtonHandler = async () => {
            try {
                await App.addListener("backButton", ({ canGoBack }) => {
                    if (!canGoBack) {
                        App.exitApp();
                    } else {
                        window.history.back();
                    }
                });
                console.log("백버튼 핸들러 등록 완료");
            } catch (error) {
                console.error("Capacitor App 플러그인 초기화 실패:", error);
            }
        };

        setupBackButtonHandler();

        return () => {
            // 컴포넌트 언마운트 시 리스너 제거
            const cleanup = async () => {
                try {
                    await App.removeAllListeners();
                } catch (error) {
                    console.error("리스너 제거 실패:", error);
                }
            };

            cleanup();
        };
    }, []);

    return null;
}
