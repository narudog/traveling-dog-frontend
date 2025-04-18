"use client";

import Airplane from "@/components/animations/Airplane";
import { useAuthStore } from "@/store/auth";
import styles from "./LoginForm.module.scss";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

function LoginForm() {
  const auth = useAuthStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [formError, setFormError] = useState("");

  const [isFlying, setIsFlying] = useState(false);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validatePassword = (value: string) => {
    return value.length >= 8;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (!validateEmail(value)) {
      setEmailError("invalid email");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (!validatePassword(value)) {
      setPasswordError("invalid password");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("invalid email");
      valid = false;
    }
    if (!validatePassword(password)) {
      setPasswordError("invalid password");
      valid = false;
    }

    if (!valid) {
      setFormError("invalid email or password");
      return;
    }

    try {
      await auth.login({ email, password });

      setFormError("");
      await handleAirplane();
      router.push("/");
      router.refresh(); // 세션 상태 갱신을 위한 새로고침
    } catch (error) {
      setFormError("로그인 중 오류가 발생했습니다.");
    }
  };

  const handleAirplane = () => {
    return new Promise((resolve) => {
      setIsFlying(true);
      setTimeout(() => {
        setIsFlying(false);
        resolve(true);
      }, 2000);
    });
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleLogin}>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="text"
            value={email}
            onChange={handleEmailChange}
          />
          {emailError && <p className={styles.error}>{emailError}</p>}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
          {passwordError && <p className={styles.error}>{passwordError}</p>}
        </div>
        <button type="submit" className={styles.button}>
          Sign In
        </button>
        <Link href="/signup" className={styles.button}>
          Sign Up
        </Link>
        {formError && <p className={styles.error}>{formError}</p>}
        {auth.error && (
          <p className={styles.error}>로그인 실패: {auth.error}</p>
        )}
        {auth.loading && <p className={styles.loading}>로그인 중...</p>}
      </form>

      <Airplane isFlying={isFlying} />
    </>
  );
}

export default LoginForm;
