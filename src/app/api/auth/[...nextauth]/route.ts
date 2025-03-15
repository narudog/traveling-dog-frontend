// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axiosInstance from '@/axios/axios';
import { AxiosError } from 'axios';
import { AuthError } from '@/types/auth';
// NextAuth 타입 확장
declare module "next-auth" {
    interface User {
        id: string;
        accessToken: string;
    }

    interface Session {
        accessToken: string;
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken: string;
        id: string;
    }
}

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "이메일", type: "email" },
                password: { label: "비밀번호", type: "password" }
            },
            async authorize(credentials) {
                try {
                    const base64Auth = Buffer.from(`${credentials?.email}:${credentials?.password}`).toString("base64");
                    // 백엔드 로그인 API 호출
                    const res = await axiosInstance.post('/auth/login', {}, {
                        headers: {
                            'Authorization': `Basic ${base64Auth}`,
                        }
                    });

                    // 쿠키 추출
                    const cookies = res.headers['set-cookie'];
                    const jwtCookie = cookies?.find(c => c.trim().startsWith('jwt='));
                    const token = jwtCookie?.split('=')[1];

                    if (res.status === 200 && token) {
                        // 사용자 정보 가져오기 (필요시)
                        const userRes = await axiosInstance.get('/user/profile', {
                            headers: {
                                'Cookie': `jwt=${token}`
                            }
                        });
                        const user = userRes.data;

                        return {
                            id: user.id,
                            name: user.nickname,
                            email: user.email,
                            accessToken: token
                        };
                    }
                    return null;
                } catch (error) {
                    console.error('Auth error:', error);

                    const errorData = (error as AxiosError).response?.data as AuthError;
                    // 백엔드에서 받은 에러 정보를 클라이언트로 전달

                    // 에러 객체를 JSON 문자열로 변환하여 전달
                    throw new Error(errorData.message);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            // 초기 로그인 시 사용자 정보와 토큰 저장
            if (user) {
                token.accessToken = user.accessToken;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            // 세션에 토큰 정보 추가
            session.accessToken = token.accessToken;
            session.user.id = token.id;
            return session;
        }
    },
    pages: {
        signIn: '/login',
        error: '/login'
    },
    session: {
        strategy: "jwt", // JWT 전략 사용
        maxAge: 30 * 24 * 60 * 60, // 30일 (초 단위)
    },
    secret: process.env.NEXTAUTH_SECRET, // 환경 변수에서 시크릿 키 가져오기
});

export { handler as GET, handler as POST };