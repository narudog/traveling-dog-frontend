"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/auth/SignupForm.module.scss";
import { useAuthStore } from "@/store/auth";

export default function SignupForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const auth = useAuthStore();
    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // 유효성 검사
        if (!email || !password || !confirmPassword || !nickname) {
            setError("모든 필드를 입력해주세요.");
            return;
        }

        if (!validateEmail(email)) {
            setError("유효한 이메일 주소를 입력해주세요.");
            return;
        }

        if (password.length < 8) {
            setError("비밀번호는 8자 이상이어야 합니다.");
            return;
        }

        if (password !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            setIsLoading(true);

            await auth.signup(email, password, nickname);

            // 홈페이지로 리다이렉트
            router.push("/");
            router.refresh(); // 세션 상태 갱신
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h1>회원가입</h1>

            <div className={styles.inputGroup}>
                <label htmlFor="email">이메일</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="nickname">닉네임</label>
                <input id="nickname" type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="password">비밀번호</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword">비밀번호 확인</label>
                <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.button} disabled={isLoading}>
                {isLoading ? "처리 중..." : "가입하기"}
            </button>
        </form>
    );
}
