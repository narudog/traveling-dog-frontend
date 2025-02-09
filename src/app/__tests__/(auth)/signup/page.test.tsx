import { fireEvent, render, screen } from "@testing-library/react";
import SignupPage from "@/app/(auth)/signup/page";
import { describe, it, expect } from "@jest/globals";

describe("Signup Page", () => {
    it("페이지 헤더 및 폼 렌더링 확인", () => {
        render(<SignupPage />);

        // 헤더가 "Create an Account" 텍스트를 포함하는지 확인
        expect(
            screen.getByRole("heading", {
                name: /create an account/i,
                level: 1,
            })
        ).toBeInTheDocument();

        // Email, Password, Confirm Password 입력 필드와 "Sign Up" 버튼 존재 여부 확인
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
    });

    it("이메일 입력 필드 유효성 검사 확인", async () => {
        render(<SignupPage />);
        const emailInput = screen.getByLabelText(/email/i);

        // 처음에는 에러 메시지가 보이지 않아야 함
        expect(screen.queryByText(/invalid email/i)).toBeNull();

        fireEvent.change(emailInput, { target: { value: "invalid-email" } });

        // 비동기적으로 렌더링되는 에러 메시지 확인
        const errorMessage = await screen.findByText(/invalid email/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it("비밀번호 입력 필드 유효성 검사 확인", async () => {
        render(<SignupPage />);
        const passwordInput = screen.getByLabelText(/^password$/i);

        expect(screen.queryByText(/invalid password/i)).toBeNull();

        fireEvent.change(passwordInput, { target: { value: "short" } });

        const errorMessage = await screen.findByText(/invalid password/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it("비밀번호 확인 필드 일치 검사 확인", async () => {
        render(<SignupPage />);
        const passwordInput = screen.getByLabelText(/^password$/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

        // 두 비밀번호 필드가 다를 경우 에러 메시지가 보이지 않는지 확인
        expect(screen.queryByText(/passwords do not match/i)).toBeNull();

        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "different" } });

        const errorMessage = await screen.findByText(/passwords do not match/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it("회원가입 버튼 클릭 시 유효성 에러 확인", async () => {
        render(<SignupPage />);
        const signupButton = screen.getByRole("button", { name: /sign up/i });
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/^password$/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

        // 에러 메시지가 처음엔 보이지 않음
        expect(screen.queryByText(/invalid input/i)).toBeNull();

        // 유효하지 않은 값 입력 (잘못된 이메일, 너무 짧은 비밀번호, 일치하지 않는 비밀번호 확인)
        fireEvent.change(emailInput, { target: { value: "invalid-email" } });
        fireEvent.change(passwordInput, { target: { value: "short" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "notmatching" } });
        fireEvent.click(signupButton);

        // 유효하지 않은 입력값에 대해 폼 전체 에러 메시지를 렌더링했다고 가정
        const errorMessage = await screen.findByText(/invalid input/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it("회원가입 버튼 클릭 시 리다이렉션 확인", () => {
        render(<SignupPage />);
        const signupButton = screen.getByRole("button", { name: /sign up/i });
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/^password$/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

        // 올바른 값을 입력한 후에 회원가입 버튼 클릭 시 홈페이지로 리다이렉션 되는지 확인
        fireEvent.change(emailInput, { target: { value: "user@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });
        fireEvent.click(signupButton);

        expect(window.location.href).toContain("/");
    });
});
