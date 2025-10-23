import { AuthService } from './auth.service';
import type { AuthUser } from './types';
import { RegisterDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    healthCheck(): {
        status: string;
        message: string;
    };
    getProfile(user: AuthUser): Promise<{
        id: string;
        email: string;
        role: string | undefined;
        metadata: any;
    }>;
    refreshToken(user: AuthUser): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            role: string | undefined;
        };
    }>;
    verify(body: {
        email: string;
        password: string;
    }): Promise<{
        success: boolean;
        data: {
            id: any;
            email: any;
            role: any;
            merchantIds: string[];
        };
        message: string;
    }>;
    register(body: RegisterDto): Promise<{
        success: boolean;
        data: {
            id: any;
            email: any;
            role: string;
        };
        message: string;
    }>;
}
