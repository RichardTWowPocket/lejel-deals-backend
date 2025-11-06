import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffDto, StaffLoginDto, StaffResponseDto, StaffLoginResponseDto, StaffStatsDto, ChangePinDto, StaffActivityDto, StaffRole } from './dto/staff.dto';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    create(createStaffDto: CreateStaffDto): Promise<StaffResponseDto>;
    findAll(page?: number, limit?: number, merchantId?: string, role?: StaffRole, isActive?: boolean): Promise<{
        staff: StaffResponseDto[];
        pagination: any;
    }>;
    getStats(): Promise<StaffStatsDto>;
    findOne(id: string): Promise<StaffResponseDto>;
    findByEmail(email: string): Promise<StaffResponseDto>;
    update(id: string, updateStaffDto: UpdateStaffDto): Promise<StaffResponseDto>;
    remove(id: string): Promise<void>;
    login(loginDto: StaffLoginDto): Promise<StaffLoginResponseDto>;
    changePin(id: string, changePinDto: ChangePinDto): Promise<void>;
    deactivate(id: string): Promise<StaffResponseDto>;
    activate(id: string): Promise<StaffResponseDto>;
    getActivity(id: string, limit?: number): Promise<StaffActivityDto[]>;
    getProfile(req: any): Promise<StaffResponseDto>;
    updateProfile(req: any, updateStaffDto: UpdateStaffDto): Promise<StaffResponseDto>;
    changeMyPin(req: any, changePinDto: ChangePinDto): Promise<void>;
}
