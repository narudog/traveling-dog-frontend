import { useSetRecoilState } from 'recoil';
import axiosInstance from '@/axios/axios';
import { authState } from '@/recoil/states/auth';

export function useAuthAction() {
    const setAuthState = useSetRecoilState(authState);

    const signup = async (base64Auth: string) => {
        // API 호출 시작: 로딩 상태 업데이트
        setAuthState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            // 헤더 정보는 세 번째 인자로 전달
            const response = await axiosInstance.post("/auth/signup", {}, {
                headers: {
                    Authorization: `Basic ${base64Auth}`,
                },
            });
            // 성공 시 결과 저장
            setAuthState({ data: response.data, loading: false, error: null });
            return response.data;
        } catch (error: any) {
            // 실패 시 에러 업데이트
            setAuthState((prev) => ({
                ...prev,
                loading: false,
                error: error?.message || '회원가입 실패',
            }));
            throw error;
        }
    };

    const login = async (base64Auth: string) => {
        // API 호출 시작: 로딩 상태 업데이트
        setAuthState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            // 헤더 정보는 세 번째 인자로 전달
            const response = await axiosInstance.post("/auth/login", {}, {
                headers: {
                    Authorization: `Basic ${base64Auth}`,
                },
            });
            // 성공 시 결과 저장
            setAuthState({ data: response.data, loading: false, error: null });
            return response.data;
        } catch (error: any) {
            // 실패 시 에러 업데이트
            setAuthState((prev) => ({
                ...prev,
                loading: false,
                error: error?.message || '로그인 실패',
            }));
            throw error;
        }
    };

    return { signup, login };
}