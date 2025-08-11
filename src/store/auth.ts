import axiosInstance from "@/lib/axios";
import { Profile } from "@/types/auth";
import { create } from "zustand";

// 인터페이스 정의
interface AuthState {
  user: Profile | null;
  loading: boolean;
  error: string | null;
  hasFetchedProfile?: boolean;
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
  socialLogin: (provider: string, token: string) => Promise<void>;
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
export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  // 초기 상태
  user: null,
  loading: false,
  error: null,
  hasFetchedProfile: false,

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
      set({
        user: response.data,
        loading: false,
        error: null,
        hasFetchedProfile: true,
      });
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
      // 브라우저 호환: btoa 사용
      const base64Auth = btoa(`${email}:${password}`);
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
      set({
        user: response.data,
        loading: false,
        error: null,
        hasFetchedProfile: true,
      });
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

  socialLogin: async (provider: string, token: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post(
        `/auth/social-login?provider=${provider}&token=${token}`
      );
      set({
        user: response.data,
        loading: false,
        error: null,
        hasFetchedProfile: true,
      });
      return response.data;
    } catch (error: any) {
      set((prev) => ({
        ...prev,
        user: null,
        loading: false,
        error: error?.message || "소셜 로그인 실패",
      }));
      throw error;
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null, hasFetchedProfile: false });
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
    // 가드: 이미 요청했거나 진행 중이면 종료
    const { hasFetchedProfile, loading } = get();
    if (hasFetchedProfile || loading) return;

    set((prev) => ({ ...prev, loading: true }));

    try {
      const config: any = { skipRefreshRetry: true };
      const response = await axiosInstance.get("/user/profile", config);
      set({ user: response.data, loading: false, hasFetchedProfile: true });
    } catch (error) {
      // 비로그인일 수 있으므로 조용히 실패 처리, 플래그만 설정하여 반복 호출 방지
      set((prev) => ({
        ...prev,
        loading: false,
        user: null,
        hasFetchedProfile: true,
      }));
    }
  },
}));
