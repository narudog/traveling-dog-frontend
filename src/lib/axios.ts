import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 20000,
});

api.interceptors.request.use(async (config) => {
  return config;
});

// 응답 인터셉터 - 토큰 만료 처리 로직 추가
api.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  async (error) => {
    // 원본 요청 저장
    const originalRequest = error.config;

    // 401 Unauthorized 에러이고 재시도하지 않은 요청인 경우
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      // 특정 요청에 한해 리프레시 재시도를 비활성화할 수 있음
      !(originalRequest as any).skipRefreshRetry
    ) {
      // 재시도 플래그 설정
      originalRequest._retry = true;

      try {
        // 리프레시 토큰으로 액세스 토큰 갱신 시도
        await axios({
          method: "post",
          url: `${originalRequest.baseURL}/auth/refresh`,
          withCredentials: true, // 쿠키 포함
        });

        // 토큰 갱신 성공 후 원래 요청 재시도
        return api(originalRequest);
      } catch (refreshError) {
        // 리프레시 실패 또는 리프레시 토큰도 만료된 경우
        console.error("액세스 토큰 갱신 실패:", refreshError);

        await axios({
          method: "post",
          url: `${originalRequest.baseURL}/auth/logout`,
          withCredentials: true, // 쿠키 포함
        });

        return Promise.reject(refreshError);
      }
    }

    // 다른 모든 에러는 그대로 반환
    return Promise.reject(error.response?.data);
  }
);

export default api;
