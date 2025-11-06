export interface AuthUser {
    id: string;
    email: string;
    role?: string;
    merchantIds?: string[];
    user_metadata?: any;
}
