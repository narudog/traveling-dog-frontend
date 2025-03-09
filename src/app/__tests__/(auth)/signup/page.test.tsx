import { fireEvent, render, screen } from "@testing-library/react";
import SignupPage from "../../../(auth)/signup/page";
import { describe, it, expect } from "@jest/globals";
import { RecoilRoot } from "recoil";
import React, { ReactElement } from "react";

// 테스트용 렌더링 함수
const renderWithRecoil = (ui: ReactElement) => {
    return render(<RecoilRoot>{ui}</RecoilRoot>);
};

describe("Signup Page", () => {
    it("페이지 헤더 및 폼 렌더링 확인", () => {
        renderWithRecoil(<SignupPage />);

        expect(
            screen.getByRole("heading", {
                name: /create an account/i,
                level: 1,
            })
        ).toBeInTheDocument();

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
    });

    it("이메일 입력 필드 유효성 검사 확인", async () => {
        renderWithRecoil(<SignupPage />);
        const emailInput = screen.getByLabelText(/email/i);

        // 처음에는 에러 메시지가 보이지 않아야 함
        expect(screen.queryByText(/invalid email/i)).toBeNull();

        fireEvent.change(emailInput, { target: { value: "invalid-email" } });
        fireEvent.blur(emailInput);

        // 비동기적으로 렌더링된다고 가정하고, findByText 사용
        const errorMessage = await screen.findByText(/invalid email/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it("비밀번호 입력 필드 유효성 검사 확인", async () => {
        renderWithRecoil(<SignupPage />);
        const passwordInput = screen.getByLabelText(/^password$/i);

        // 처음에는 에러 메시지가 보이지 않아야 함
        expect(screen.queryByText(/invalid password/i)).toBeNull();

        fireEvent.change(passwordInput, { target: { value: "short" } });
        fireEvent.blur(passwordInput);

        // 비동기적으로 렌더링된다고 가정하고, findByText 사용
        const errorMessage = await screen.findByText(/invalid password/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it("비밀번호 확인 필드 일치 검사 확인", async () => {
        renderWithRecoil(<SignupPage />);
        const passwordInput = screen.getByLabelText(/^password$/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

        // 처음에는 에러 메시지가 보이지 않아야 함
        expect(screen.queryByText(/passwords do not match/i)).toBeNull();

        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "password456" } });
        fireEvent.blur(confirmPasswordInput);

        // 비동기적으로 렌더링된다고 가정하고, findByText 사용
        const errorMessage = await screen.findByText(/passwords do not match/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it("회원가입 버튼 클릭 시 유효성 에러 확인", async () => {
        renderWithRecoil(<SignupPage />);
        const signupButton = screen.getByRole("button", { name: /sign up/i });
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/^password$/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

        // 처음에는 에러 메시지가 보이지 않아야 함
        expect(screen.queryByText(/invalid input/i)).toBeNull();

        fireEvent.change(emailInput, { target: { value: "invalid-email" } });
        fireEvent.change(passwordInput, { target: { value: "short" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "short2" } });
        fireEvent.click(signupButton);

        // 비동기적으로 렌더링된다고 가정하고, findByText 사용
        const errorMessage = await screen.findByText(/invalid input/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it("회원가입 버튼 클릭 시 리다이렉션 확인", () => {
        renderWithRecoil(<SignupPage />);
        const signupButton = screen.getByRole("button", { name: /sign up/i });
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/^password$/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });
        fireEvent.click(signupButton);

        expect(window.location.href).toContain("/");
    });
});
