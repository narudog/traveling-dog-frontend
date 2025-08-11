import axiosInstance from "@/lib/axios";
import { Profile } from "@/types/auth";
import { create } from "zustand";

// 인터페이스 정의
interface AuthState {
  user: Profile | null;
  loading: boolean;
  error: string | null;
}

// 액션 인터페이스
interface AuthActions {
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getUserProfile: () => Promise<void>;
  signup: ({
    nickname,
    email,
    password,
  }: {
    nickname: string;
    email: string;
    password: string;
  }) => Promise<void>;
}

// 스토어 생성
export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  // 초기 상태
  user: null,
  loading: false,
  error: null,

  signup: async ({
    nickname,
    email,
    password,
  }: {
    nickname: string;
    email: string;
    password: string;
  }) => {
    set({ loading: true, error: null });
    try {
      // 헤더 정보는 세 번째 인자로 전달
      const response = await axiosInstance.post("/auth/signup", {
        nickname,
        email,
        password,
      });
      // 성공 시 결과 저장
      set({ user: response.data, loading: false, error: null });
      return response.data;
    } catch (error: any) {
      console.log(error);
      // 실패 시 에러 업데이트
      set((prev) => ({
        ...prev,
        user: null,
        loading: false,
        error: error?.message || "회원가입 실패",
      }));
      throw error;
    }
  },

  // 액션
  login: async ({ email, password }: { email: string; password: string }) => {
    // API 호출 시작: 로딩 상태 업데이트
    set((prev) => ({ ...prev, loading: true, error: null }));
    try {
      // 브라우저 호환: Buffer 대신 btoa 사용
      const base64Auth =
        typeof window !== "undefined"
          ? btoa(`${email}:${password}`)
          : Buffer.from(`${email}:${password}`).toString("base64");
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
        user: null,
        loading: false,
        error: error?.message || "로그인 실패",
      }));
      throw error;
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null });
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  getUserProfile: async () => {
    set((prev) => ({ ...prev, loading: true }));
    try {
      const response = await axiosInstance.get("/user/profile");
      set({ user: response.data, loading: false });
    } catch (error) {
      set((prev) => ({ ...prev, loading: false, user: null }));
      console.error("유저 프로필 조회 중 오류 발생:", error);
    }
  },
}));
