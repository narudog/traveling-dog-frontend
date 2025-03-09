// Recoil 모킹
import React from "react";

// 모의 Recoil 상태
const mockRecoilState = {
    authState: {
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
    },
};

// 모의 RecoilRoot 컴포넌트
export const RecoilRoot = ({ children }) => {
    return <>{children}</>;
};

// 모의 atom 함수
export const atom = (config) => ({
    key: config.key,
    default: config.default,
});

// 모의 selector 함수
export const selector = (config) => ({
    key: config.key,
    get: config.get,
});

// 모의 useRecoilState 훅
export const useRecoilState = (recoilState) => {
    const key = recoilState.key;
    const defaultValue = recoilState.default;

    // 키에 따라 적절한 상태 반환
    let state;
    if (key === "authState") {
        state = mockRecoilState.authState;
    } else {
        state = defaultValue;
    }

    const setState = jest.fn();
    return [state, setState];
};

// 모의 useRecoilValue 훅
export const useRecoilValue = (recoilState) => {
    const key = recoilState.key;
    const defaultValue = recoilState.default;

    // 키에 따라 적절한 상태 반환
    if (key === "authState") {
        return mockRecoilState.authState;
    }

    return defaultValue;
};

// 모의 useSetRecoilState 훅
export const useSetRecoilState = (recoilState) => {
    return jest.fn();
};

// 모의 useResetRecoilState 훅
export const useResetRecoilState = (recoilState) => {
    return jest.fn();
};

// 모킹 설정
export const setupRecoilMock = () => {
    jest.mock("recoil", () => ({
        RecoilRoot,
        atom,
        selector,
        useRecoilState,
        useRecoilValue,
        useSetRecoilState,
        useResetRecoilState,
    }));
};
