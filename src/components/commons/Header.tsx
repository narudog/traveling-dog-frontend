"use client";

import styles from "./Header.module.scss";
import Image from "next/image";
import Link from "next/link";
import AuthenticatedButtons from "./AuthenticatedButtons";
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";
import UnauthenticatedButtons from "./UnauthenticatedButtons";
const Header = () => {
  const { user, getUserProfile } = useAuthStore();

  useEffect(() => {
    if (!user) {
      getUserProfile();
    }
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={120} height={40} />
        </Link>
      </div>
      <div className={styles.authButtons}>
        {!user ? (
          <div className={styles.skeleton}>
            <div className={styles.skeletonButton}></div>
            <div className={styles.skeletonButton}></div>
          </div>
        ) : (
          <>{user.id ? <AuthenticatedButtons /> : <UnauthenticatedButtons />}</>
        )}
      </div>
    </header>
  );
};

export default Header;
