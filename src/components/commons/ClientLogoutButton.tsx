"use client";

import { signOut } from "next-auth/react";
import styles from "@/styles/commons/Header.module.scss";

const ClientLogoutButton = () => {
    return (
        <button onClick={() => signOut()} className={styles.logoutButton}>
            로그아웃
        </button>
    );
};

export default ClientLogoutButton;
