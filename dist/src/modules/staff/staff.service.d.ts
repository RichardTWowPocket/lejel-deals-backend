import { PrismaService } from '../../prisma/prisma.service';
import { CreateStaffDto, UpdateStaffDto, StaffLoginDto, StaffResponseDto, StaffLoginResponseDto, StaffStatsDto, ChangePinDto, StaffActivityDto, StaffRole } from './dto/staff.dto';
export declare class StaffService {
    private prisma;
    private readonly logger;
    private readonly jwtSecret;
    private readonly jwtExpiresIn;
    constructor(prisma: PrismaService);
    create(createStaffDto: CreateStaffDto): Promise<StaffResponseDto>;
    findAll(page?: number, limit?: number, merchantId?: string, role?: StaffRole, isActive?: boolean): Promise<{
        staff: StaffResponseDto[];
        pagination: any;
    }>;
    findOne(id: string): Promise<StaffResponseDto>;
    findByEmail(email: string): Promise<StaffResponseDto>;
    update(id: string, updateStaffDto: UpdateStaffDto): Promise<StaffResponseDto>;
    remove(id: string): Promise<void>;
    login(loginDto: StaffLoginDto): Promise<StaffLoginResponseDto>;
    changePin(id: string, changePinDto: ChangePinDto): Promise<void>;
    deactivate(id: string): Promise<StaffResponseDto>;
    activate(id: string): Promise<StaffResponseDto>;
    getStats(): Promise<StaffStatsDto>;
    getStaffActivity(staffId: string, limit?: number): Promise<StaffActivityDto[]>;
    private mapToResponseDto;
}
