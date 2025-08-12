import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Google 로그인 시 ID 토큰을 JWT에 저장
      if (account?.provider === "google") {
        token.googleIdToken = account.id_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      // 세션에 Google ID 토큰 포함
      if (token.googleIdToken) {
        (session as any).googleIdToken = token.googleIdToken;
        (session as any).provider = token.provider;
      }
      return session;
    },
    async signIn({ account, profile }) {
      // Google 로그인 성공 시 ID 토큰이 있는지 확인
      if (account?.provider === "google" && account.id_token) {
        return true;
      }
      return false;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
