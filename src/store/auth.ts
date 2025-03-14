import axiosInstance from "@/axios/axios";
import { create } from "zustand";

// 인터페이스 정의
interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// 액션 인터페이스
interface AuthActions {
  login: (base64Auth: string) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signup: (base64Auth: string) => Promise<void>;
}

// 스토어 생성
export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  // 초기 상태
  user: null,
  token: null,
  loading: false,
  error: null,

  signup: async (base64Auth: string) => {
    set({ loading: true, error: null });
    try {
      // 헤더 정보는 세 번째 인자로 전달
      const response = await axiosInstance.post(
        "/auth/signup",
        {},
        {
          headers: {
            Authorization: `Basic ${base64Auth}`,
          },
        }
      );
      // 성공 시 결과 저장
      set({ user: response.data, loading: false, error: null });
      return response.data;
    } catch (error: any) {
      // 실패 시 에러 업데이트
      set((prev) => ({
        ...prev,
        loading: false,
        error: error?.message || "회원가입 실패",
      }));
      throw error;
    }
  },

  // 액션
  login: async (base64Auth: string) => {
    // API 호출 시작: 로딩 상태 업데이트
    set((prev) => ({ ...prev, loading: true, error: null }));
    try {
      // 헤더 정보는 세 번째 인자로 전달
      const response = await axiosInstance.post(
        "/auth/login",
        {},
        {
          headers: {
            Authorization: `Basic ${base64Auth}`,
          },
        }
      );
      // 성공 시 결과 저장
      set({ user: response.data, loading: false, error: null });
      return response.data;
    } catch (error: any) {
      // 실패 시 에러 업데이트
      set((prev) => ({
        ...prev,
        loading: false,
        error: error?.message || "로그인 실패",
      }));
      throw error;
    }
  },

  logout: () => {
    set({ user: null, token: null });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
