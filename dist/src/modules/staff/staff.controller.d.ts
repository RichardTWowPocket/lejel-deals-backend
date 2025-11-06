import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffDto, StaffLoginDto, StaffResponseDto, StaffLoginResponseDto, StaffStatsDto, ChangePinDto, StaffActivityDto, StaffRole } from './dto/staff.dto';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    create(createStaffDto: CreateStaffDto): Promise<StaffResponseDto>;
    findAll(req: any, page?: number, limit?: number, merchantId?: string, role?: StaffRole, isActive?: boolean): Promise<{
        staff: StaffResponseDto[];
        pagination: any;
    }>;
    getStats(): Promise<StaffStatsDto>;
    findOne(req: any, id: string): Promise<StaffResponseDto>;
    findByEmail(email: string): Promise<StaffResponseDto>;
    update(req: any, id: string, updateStaffDto: UpdateStaffDto): Promise<StaffResponseDto>;
    remove(id: string): Promise<void>;
    login(loginDto: StaffLoginDto): Promise<StaffLoginResponseDto>;
    changePin(req: any, id: string, changePinDto: ChangePinDto): Promise<void>;
    deactivate(req: any, id: string): Promise<StaffResponseDto>;
    activate(req: any, id: string): Promise<StaffResponseDto>;
    getActivity(id: string, limit?: number): Promise<StaffActivityDto[]>;
    getProfile(req: any): Promise<StaffResponseDto>;
    updateProfile(req: any, updateStaffDto: UpdateStaffDto): Promise<StaffResponseDto>;
    changeMyPin(req: any, changePinDto: ChangePinDto): Promise<void>;
}
