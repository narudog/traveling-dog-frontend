"use client";

import Link from "next/link";
import styles from "./Header.module.scss";
import { useAuthStore } from "@/store/auth";

const AuthenticatedButtons = () => {
  const { logout } = useAuthStore();

  return (
    <>
      <Link
        href="/travel-plan/list"
        className={`${styles.headerButton} ${styles.travelPlanButton}`}
      >
        내 여행
      </Link>
      <button
        onClick={logout}
        className={`${styles.headerButton} ${styles.logoutButton}`}
      >
        로그아웃
      </button>
    </>
  );
};

export default AuthenticatedButtons;
