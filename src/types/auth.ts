export type AuthError = {
    code: string;
    message: string;
    errors: Record<string, string>;
};


export type SignInResult = {
    ok: boolean;
    error: AuthError;
};
