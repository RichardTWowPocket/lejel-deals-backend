import { PrismaService } from '../../prisma/prisma.service';
import { CreateStaffDto, UpdateStaffDto, StaffLoginDto, StaffResponseDto, StaffLoginResponseDto, StaffStatsDto, ChangePinDto, StaffActivityDto, StaffRole } from './dto/staff.dto';
import { MerchantRole } from '@prisma/client';
export declare class StaffService {
    private prisma;
    private readonly logger;
    private readonly jwtSecret;
    private readonly jwtExpiresIn;
    private readonly roleHierarchy;
    constructor(prisma: PrismaService);
    private canAccessStaffRole;
    create(createStaffDto: CreateStaffDto): Promise<StaffResponseDto>;
    findAll(page?: number, limit?: number, merchantId?: string, role?: StaffRole, isActive?: boolean, currentUserRole?: MerchantRole): Promise<{
        staff: StaffResponseDto[];
        pagination: any;
    }>;
    findOne(id: string, currentUserRole?: MerchantRole): Promise<StaffResponseDto>;
    findByEmail(email: string): Promise<StaffResponseDto>;
    update(id: string, updateStaffDto: UpdateStaffDto, currentUserRole?: MerchantRole): Promise<StaffResponseDto>;
    remove(id: string): Promise<void>;
    login(loginDto: StaffLoginDto): Promise<StaffLoginResponseDto>;
    changePin(id: string, changePinDto: ChangePinDto, currentUserRole?: MerchantRole): Promise<void>;
    deactivate(id: string, currentUserRole?: MerchantRole): Promise<StaffResponseDto>;
    activate(id: string, currentUserRole?: MerchantRole): Promise<StaffResponseDto>;
    getStats(): Promise<StaffStatsDto>;
    getStaffActivity(staffId: string, limit?: number): Promise<StaffActivityDto[]>;
    private mapToResponseDto;
}
