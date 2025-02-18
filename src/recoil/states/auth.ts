import { atom } from 'recoil';

export interface AuthState {
    data: any;
    loading: boolean;
    error: string | null;
}

export const authState = atom<AuthState>({
    key: 'authState', // 고유한 key
    default: {
        data: null,
        loading: false,
        error: null,
    },
});