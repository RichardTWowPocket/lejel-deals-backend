export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RegisterDto {
    email: string;
    password: string;
    name?: string;
}
export declare class UserProfileDto {
    id: string;
    email: string;
    role?: string;
    firstName?: string;
    lastName?: string;
}
export declare class OAuthGoogleDto {
    email: string;
    providerId: string;
    name?: string;
    avatar?: string;
    firstName?: string;
    lastName?: string;
}
