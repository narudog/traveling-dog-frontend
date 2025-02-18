"use client";

import { useState } from "react";
import styles from "@/styles/auth/SignupForm.module.scss";
import { useAuthAction } from "@/recoil/actions/auth";
import { useRouter } from "next/navigation";

const Signup = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const [formError, setFormError] = useState("");

    const { signup } = useAuthAction();

    const validateEmail = (value: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
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
        // 비밀번호 변경 시, 비밀번호 확인 필드도 체크
        if (confirmPassword && value !== confirmPassword) {
            setConfirmPasswordError("passwords do not match");
        } else {
            setConfirmPasswordError("");
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if (password !== value) {
            setConfirmPasswordError("passwords do not match");
        } else {
            setConfirmPasswordError("");
        }
    };

    const submitSignup = async () => {
        try {
            // base64로 인코딩하여 basic auth로 로그인
            const base64Auth = Buffer.from(`${email}:${password}`).toString("base64");
            await signup(base64Auth);
        } catch (error) {
            console.log(error);
            setFormError("invalid input");
        }
    };

    const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
        if (password !== confirmPassword) {
            setConfirmPasswordError("passwords do not match");
            valid = false;
        }

        if (!valid) {
            setFormError("invalid input");
            return;
        }

        await submitSignup();
        setFormError("");
        router.push("/");
    };

    return (
        <form className={styles.form}>
            <div className={styles.inputGroup}>
                <label htmlFor="email">Email</label>
                <input id="email" type="text" value={email} onChange={handleEmailChange} />
                {emailError && <p className={styles.error}>{emailError}</p>}
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" value={password} onChange={handlePasswordChange} />
                {passwordError && <p className={styles.error}>{passwordError}</p>}
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input id="confirmPassword" type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
                {confirmPasswordError && <p className={styles.error}>{confirmPasswordError}</p>}
            </div>
            <button type="button" onClick={handleSignup} className={styles.button}>
                Sign Up
            </button>
            {formError && <p className={styles.error}>{formError}</p>}
        </form>
    );
};

export default Signup;
