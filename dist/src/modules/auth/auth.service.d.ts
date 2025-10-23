import { LoginDto, RegisterDto } from './dto/auth.dto';
import type { AuthUser } from './types';
import { PrismaService } from '../../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaService);
    login(_loginDto: LoginDto): Promise<void>;
    register(_registerDto: RegisterDto): Promise<void>;
    validateUser(token: string): Promise<AuthUser>;
    getUserById(_userId: string): Promise<AuthUser | null>;
    getSupabaseClient(): Promise<void>;
    verifyCredentials(email: string, password: string): Promise<{
        success: boolean;
        data: {
            id: any;
            email: any;
            role: any;
            merchantIds: string[];
        };
        message: string;
    }>;
    registerUser(dto: RegisterDto): Promise<{
        success: boolean;
        data: {
            id: any;
            email: any;
            role: string;
        };
        message: string;
    }>;
}
