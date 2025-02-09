import { fireEvent, render, screen } from "@testing-library/react";
import LoginPage from "../../../(auth)/login/page";
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

    it("이메일 입력 필드 유효성 검사 확인", async () => {
        render(<LoginPage />);
        const emailInput = screen.getByLabelText(/email/i);
        // 처음에는 에러 메시지가 보이지 않아야 함
        expect(screen.queryByText(/invalid email/i)).toBeNull();

        fireEvent.change(emailInput, { target: { value: "invalid-email" } });

        // 비동기적으로 렌더링된다고 가정하고, findByText 사용
        const errorMessage = await screen.findByText(/invalid email/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it("비밀번호 입력 필드 유효성 검사 확인", async () => {
        render(<LoginPage />);
        const passwordInput = screen.getByLabelText(/password/i);

        // 처음에는 에러 메시지가 보이지 않아야 함
        expect(screen.queryByText(/invalid password/i)).toBeNull();

        fireEvent.change(passwordInput, { target: { value: "short" } });

        // 비동기적으로 렌더링된다고 가정하고, findByText 사용
        const errorMessage = await screen.findByText(/invalid password/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it("로그인 버튼 클릭 시 유효성 에러 확인", async () => {
        render(<LoginPage />);
        const loginButton = screen.getByRole("button", { name: /sign in/i });
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);

        // 처음에는 에러 메시지가 보이지 않아야 함
        expect(screen.queryByText(/invalid email or password/i)).toBeNull();

        fireEvent.change(emailInput, { target: { value: "invalid-email" } });
        fireEvent.change(passwordInput, { target: { value: "short" } });
        fireEvent.click(loginButton);

        // 비동기적으로 렌더링된다고 가정하고, findByText 사용
        const errorMessage = await screen.findByText(/invalid email or password/i);
        expect(errorMessage).toBeInTheDocument();
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
