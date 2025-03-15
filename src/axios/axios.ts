import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    return config;
});

api.interceptors.response.use(
    (response) => {
        return Promise.resolve(response.data);
    },
    (error) => {
        if (error.response.status === 401) {
            localStorage.removeItem("token");
        }
        return Promise.reject(error.response.data);
    }
);

export default api;
