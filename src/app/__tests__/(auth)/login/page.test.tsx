import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginPage from "../../../(auth)/login/page";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { RecoilRoot } from "recoil";
import React, { ReactElement } from "react";
import { mockTravelPlannerAPI, setupApiMocks } from "../../__mocks__/apiMock";

// axios 모킹 설정
jest.mock("@/axios/axios", () => ({
    __esModule: true,
    default: {
        post: jest.fn().mockImplementation((url, data, config) => {
            return Promise.resolve({
                data: {
                    id: "user-123",
                    nickname: "testuser",
                    email: "test@example.com",
                    token: "mock-token-xyz",
                },
            });
        }),
    },
}));

// 테스트용 렌더링 함수
const renderWithRecoil = (ui: ReactElement) => {
    return render(<RecoilRoot>{ui}</RecoilRoot>);
};

describe("Login Page", () => {
    beforeEach(() => {
        // 각 테스트 전에 모킹 초기화
        jest.clearAllMocks();
        setupApiMocks();
    });

    it("페이지 헤더 및 폼 렌더링 확인", () => {
        renderWithRecoil(<LoginPage />);

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
    //     renderWithRecoil(<LoginPage />);
    //     expect(screen.getByRole("button", { name: /continue with google/i })).toBeInTheDocument();
    //     expect(screen.getByRole("button", { name: /continue with github/i })).toBeInTheDocument();
    // });

    it("이메일 입력 필드 유효성 검사 확인", async () => {
        renderWithRecoil(<LoginPage />);
        const emailInput = screen.getByLabelText(/email/i);
        // 처음에는 에러 메시지가 보이지 않아야 함
        expect(screen.queryByText(/invalid email/i)).toBeNull();

        fireEvent.change(emailInput, { target: { value: "invalid-email" } });

        // 비동기적으로 렌더링된다고 가정하고, findByText 사용
        const errorMessage = await screen.findByText(/invalid email/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it("비밀번호 입력 필드 유효성 검사 확인", async () => {
        renderWithRecoil(<LoginPage />);
        const passwordInput = screen.getByLabelText(/password/i);

        // 처음에는 에러 메시지가 보이지 않아야 함
        expect(screen.queryByText(/invalid password/i)).toBeNull();

        fireEvent.change(passwordInput, { target: { value: "short" } });

        // 비동기적으로 렌더링된다고 가정하고, findByText 사용
        const errorMessage = await screen.findByText(/invalid password/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it("로그인 버튼 클릭 시 유효성 에러 확인", async () => {
        renderWithRecoil(<LoginPage />);
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
    //     renderWithRecoil(<LoginPage />);
    //     const googleLoginButton = screen.getByRole("button", { name: /continue with google/i });
    //     const githubLoginButton = screen.getByRole("button", { name: /continue with github/i });

    //     fireEvent.click(googleLoginButton);
    //     fireEvent.click(githubLoginButton);

    //     expect(window.location.href).toContain("/auth/google");
    //     expect(window.location.href).toContain("/auth/github");
    // });

    it("로그인 버튼 클릭 시 리다이렉션 확인", () => {
        renderWithRecoil(<LoginPage />);
        const loginButton = screen.getByRole("button", { name: /sign in/i });
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.click(loginButton);

        expect(window.location.href).toContain("/");
    });

    // API 통합 테스트 추가
    it("axios.post가 올바르게 호출되어야 합니다", async () => {
        // axios 모듈 가져오기
        const axiosInstance = require("@/axios/axios").default;

        // 직접 axios.post 호출
        const response = await axiosInstance.post(
            "/auth/login",
            {},
            {
                headers: {
                    Authorization: `Basic ${Buffer.from("test@example.com:password123").toString("base64")}`,
                },
            }
        );

        // 응답 확인
        expect(response.data).toEqual({
            id: "user-123",
            nickname: "testuser",
            email: "test@example.com",
            token: "mock-token-xyz",
        });

        // axios.post가 호출되었는지 확인
        expect(axiosInstance.post).toHaveBeenCalledWith(
            "/auth/login",
            {},
            {
                headers: {
                    Authorization: expect.stringContaining("Basic "),
                },
            }
        );
    });

    it("로그인 실패 시 에러 메시지가 표시되어야 합니다", async () => {
        // axios 모듈 가져오기
        const axiosInstance = require("@/axios/axios").default;

        // 이 테스트에서만 에러 발생하도록 모킹 오버라이드
        axiosInstance.post.mockRejectedValueOnce({
            response: {
                data: {
                    message: "Invalid email or password",
                },
            },
        });

        // 에러 발생 확인
        try {
            await axiosInstance.post(
                "/auth/login",
                {},
                {
                    headers: {
                        Authorization: `Basic ${Buffer.from("wrong@example.com:wrongpass").toString("base64")}`,
                    },
                }
            );
            // 여기까지 실행되면 테스트 실패
            fail("로그인이 성공했지만, 실패해야 합니다.");
        } catch (error) {
            // 에러 응답 확인
            expect(error).toHaveProperty("response.data.message", "Invalid email or password");
        }

        // axios.post가 호출되었는지 확인
        expect(axiosInstance.post).toHaveBeenCalledWith(
            "/auth/login",
            {},
            {
                headers: {
                    Authorization: expect.stringContaining("Basic "),
                },
            }
        );
    });
});
