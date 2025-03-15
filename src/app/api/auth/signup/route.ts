import { NextResponse } from 'next/server';
import axiosInstance from '@/axios/axios';
import { encode } from 'next-auth/jwt';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, nickname } = body;

        // 백엔드 회원가입 API 호출
        const response = await axiosInstance.post('/auth/signup', {
            email,
            password,
            nickname
        });

        // 회원가입 성공 및 JWT 토큰 받음
        if (response.status === 201) {
            // 쿠키 추출
            const cookies = response.headers['set-cookie'];
            const jwtCookie = cookies?.find(c => c.trim().startsWith('jwt='));
            const token = jwtCookie?.split('=')[1];

            if (response.status === 201 && token) {
                // 사용자 정보 가져오기 (필요시)
                const userRes = await axiosInstance.get('/user/profile', {
                    headers: {
                        'Cookie': `jwt=${token}`
                    }
                });
                const user = userRes.data;

                // NextAuth 세션 토큰 생성
                const sessionToken = await encode({
                    token: {
                        id: user.id,
                        name: user.nickname,
                        email: user.email,
                        accessToken: token
                    },
                    secret: process.env.NEXTAUTH_SECRET || ''
                });

                // 응답 생성
                const nextResponse = NextResponse.json({
                    success: true,
                    user: {
                        id: user.id,
                        name: user.nickname,
                        email: user.email
                    }
                });

                // NextAuth 세션 쿠키 설정
                nextResponse.cookies.set({
                    name: 'next-auth.session-token',
                    value: sessionToken,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 30 * 24 * 60 * 60 // 30일
                });

                return nextResponse;
            }
            return null;
        }
    } catch (error: any) {
        console.error('회원가입 오류:', error);
        return NextResponse.json(
            {
                success: false,
                message: error.response?.data?.message || '회원가입 중 오류가 발생했습니다.'
            },
            { status: 500 }
        );
    }
}