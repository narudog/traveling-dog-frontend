"use client";

import styles from "./BottomNavigation.module.scss";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";
import { FaHome, FaSearch, FaHeart, FaUser } from "react-icons/fa";

const BottomNavigation = () => {
  const { user, getUserProfile } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      getUserProfile();
    }
  }, [user, getUserProfile]);

  // 현재 활성화된 메뉴 확인
  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  // 로그인이 필요한 페이지로 이동 시 처리
  const handleAuthRequiredNavigation = (path: string) => {
    if (!user && path === "/profile") {
      router.push("/login");
    } else {
      router.push(path);
    }
  };

  return (
    <nav className={styles.bottomNavigation}>
      <div className={styles.navItem}>
        <Link href="/" className={isActive("/") ? styles.active : ""}>
          <FaHome size={24} />
          <span>홈</span>
        </Link>
      </div>

      <div className={styles.navItem}>
        <Link
          href="/search"
          className={isActive("/search") ? styles.active : ""}
        >
          <FaSearch size={24} />
          <span>검색</span>
        </Link>
      </div>

      <div
        className={styles.navItem}
        onClick={() => handleAuthRequiredNavigation("/travel-plan/list")}
      >
        <div className={isActive("/travel-plan/list") ? styles.active : ""}>
          <FaHeart size={24} />
          <span>내 여행</span>
        </div>
      </div>

      <div
        className={styles.navItem}
        onClick={() => handleAuthRequiredNavigation("/profile")}
      >
        <div className={isActive("/profile") ? styles.active : ""}>
          <FaUser size={24} />
          <span>프로필</span>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
