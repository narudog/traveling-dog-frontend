"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import styles from "./HeaderQR.module.scss";
import { FiSmartphone, FiX } from "react-icons/fi";

const HeaderQR = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const playStoreUrl =
    "https://play.google.com/store/apps/details?id=com.narudog.traveling_dog_app";

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(playStoreUrl, {
          width: 120,
          margin: 1,
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
    <div className={styles.headerQR}>
      <button
        className={styles.qrButton}
        onClick={() => setIsOpen(!isOpen)}
        title="안드로이드 앱 다운로드"
      >
        <FiSmartphone />
        <span>앱</span>
      </button>

      {isOpen && (
        <>
          <div className={styles.overlay} onClick={() => setIsOpen(false)} />
          <div className={styles.qrModal}>
            <div className={styles.modalHeader}>
              <h3>안드로이드 앱 다운로드</h3>
              <button
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
              >
                <FiX />
              </button>
            </div>
            <div className={styles.qrContent}>
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
        </>
      )}
    </div>
  );
};

export default HeaderQR;
