"use client";

import styles from "./Header.module.scss";
import { useAuthStore } from "@/store/auth";

const ClientLogoutButton = () => {
    const { logout } = useAuthStore();

    return (
        <button onClick={logout} className={styles.logoutButton}>
            로그아웃
        </button>
    );
};

export default ClientLogoutButton;
