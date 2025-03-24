export type AuthError = {
    code: string;
    message: string;
    errors: Record<string, string>;
};


export type SignInResult = {
    ok: boolean;
    error: AuthError;
};

export type Profile = {
    id: number | null;
    email: string | null;
    nickname: string | null;
    preferredTravelStyle: string | null;
    favoriteDestinations: string[] | null;
};

