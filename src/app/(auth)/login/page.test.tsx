import { fireEvent, render, screen } from "@testing-library/react";
import LoginPage from "./page";
import { describe, it, expect } from "@jest/globals";

describe("Login Page", () => {
    it("페이지 헤더 및 폼 렌더링 확인", () => {
        render(<LoginPage />);

        expect(
            screen.getByRole("heading", {
                name: /welcome to traveling dog/i,
                level: 1,
            })
        ).toBeInTheDocument();

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    });

    // it("소셜 로그인 버튼 존재 확인", () => {
    //     render(<LoginPage />);
    //     expect(screen.getByRole("button", { name: /continue with google/i })).toBeInTheDocument();
    //     expect(screen.getByRole("button", { name: /continue with github/i })).toBeInTheDocument();
    // });

    it("이메일 입력 필드 유효성 검사 확인", () => {
        render(<LoginPage />);
        const emailInput = screen.getByLabelText(/email/i);
        const errorMessage = screen.getByText(/invalid email/i);

        fireEvent.change(emailInput, { target: { value: "invalid-email" } });
        expect(errorMessage).toBeInTheDocument();
    });

    it("비밀번호 입력 필드 유효성 검사 확인", () => {
        render(<LoginPage />);
        const passwordInput = screen.getByLabelText(/password/i);
        const errorMessage = screen.getByText(/invalid password/i);

        fireEvent.change(passwordInput, { target: { value: "short" } });
        expect(errorMessage).toBeInTheDocument();
    });

    it("로그인 버튼 클릭 시 유효성 검사 확인", () => {
        render(<LoginPage />);
        const loginButton = screen.getByRole("button", { name: /sign in/i });
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const errorMessage = screen.getByText(/invalid email or password/i);

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.click(loginButton);

        expect(errorMessage).not.toBeInTheDocument();
    });

    // it("소셜 로그인 버튼 클릭 시 리다이렉션 확인", () => {
    //     render(<LoginPage />);
    //     const googleLoginButton = screen.getByRole("button", { name: /continue with google/i });
    //     const githubLoginButton = screen.getByRole("button", { name: /continue with github/i });

    //     fireEvent.click(googleLoginButton);
    //     fireEvent.click(githubLoginButton);

    //     expect(window.location.href).toContain("/auth/google");
    //     expect(window.location.href).toContain("/auth/github");
    // });

    it("로그인 버튼 클릭 시 리다이렉션 확인", () => {
        render(<LoginPage />);
        const loginButton = screen.getByRole("button", { name: /sign in/i });
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.click(loginButton);

        expect(window.location.href).toContain("/");
    });
});
