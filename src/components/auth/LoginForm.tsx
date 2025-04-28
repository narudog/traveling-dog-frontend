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
      setEmailError("유효한 이메일을 입력해주세요");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (!validatePassword(value)) {
      setPasswordError("비밀번호는 8자 이상이어야 합니다");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("유효한 이메일을 입력해주세요");
      valid = false;
    }
    if (!validatePassword(password)) {
      setPasswordError("비밀번호는 8자 이상이어야 합니다");
      valid = false;
    }

    try {
      await auth.login({ email, password });

      setFormError("");
      router.push("/");
      router.refresh(); // 세션 상태 갱신을 위한 새로고침
    } catch (error) {
      setFormError("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleLogin}>
        <div className={styles.inputGroup}>
          <label htmlFor="email">이메일</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="example@example.com"
            autoComplete="email"
          />
          {emailError && (
            <p className={styles.error}>유효한 이메일을 입력해주세요</p>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="8자 이상 입력해주세요"
            autoComplete="current-password"
          />
          {passwordError && (
            <p className={styles.error}>비밀번호는 8자 이상이어야 합니다</p>
          )}
        </div>
        <button type="submit" className={styles.button}>
          로그인
        </button>
        <Link href="/signup" className={styles.button}>
          회원가입
        </Link>
        {formError && <p className={styles.error}>로그인 실패: {formError}</p>}
        {auth.loading && <p className={styles.loading}>로그인 중...</p>}
      </form>
    </>
  );
}

export default LoginForm;
