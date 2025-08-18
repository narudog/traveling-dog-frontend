"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import styles from "./AppDownload.module.scss";
import { FiDownload, FiSmartphone } from "react-icons/fi";

const AppDownload = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const playStoreUrl =
    "https://play.google.com/store/apps/details?id=com.narudog.traveling_dog_app";

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(playStoreUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: "#1f2937",
            light: "#ffffff",
          },
        });
        setQrCodeUrl(url);
      } catch (error) {
        console.error("QR 코드 생성 오류:", error);
      }
    };

    generateQR();
  }, []);

  return (
    <section className={styles.appDownload}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <div className={styles.badge}>
              <FiSmartphone />
              <span>모바일 앱</span>
            </div>
            <h2>더 편리한 여행 계획을 위해</h2>
            <p>
              Traveling 모바일 앱으로 언제 어디서나 여행 계획을 세우고
              관리하세요
            </p>
          </div>

          <div className={styles.qrSection}>
            <div className={styles.qrContainer}>
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="Google Play Store QR 코드"
                  className={styles.qrCode}
                />
              ) : (
                <div className={styles.qrPlaceholder}>QR 코드 생성 중...</div>
              )}
              <p className={styles.qrText}>
                QR 코드를 스캔하여
                <br />
                바로 다운로드하세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
