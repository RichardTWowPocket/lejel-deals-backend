import { RedemptionService } from './redemptions.service';
import { CreateRedemptionDto, RedemptionResponseDto, RedemptionStatsDto, RedemptionAnalyticsDto, RedemptionValidationDto } from './dto/redemption.dto';
import { RedemptionStatus } from '@prisma/client';
export declare class RedemptionController {
    private readonly redemptionService;
    constructor(redemptionService: RedemptionService);
    processRedemption(createRedemptionDto: CreateRedemptionDto): Promise<RedemptionResponseDto>;
    validateRedemption(body: {
        qrToken: string;
        staffId: string;
    }): Promise<RedemptionValidationDto>;
    findAll(page?: number, limit?: number, merchantId?: string, staffId?: string, status?: RedemptionStatus, startDate?: Date, endDate?: Date): Promise<{
        redemptions: RedemptionResponseDto[];
        pagination: any;
    }>;
    getRedemptionStats(merchantId?: string): Promise<RedemptionStatsDto>;
    getRedemptionAnalytics(merchantId?: string, startDate?: Date, endDate?: Date): Promise<RedemptionAnalyticsDto>;
    findOne(id: string): Promise<RedemptionResponseDto>;
    updateStatus(id: string, body: {
        status: RedemptionStatus;
        notes?: string;
    }): Promise<RedemptionResponseDto>;
    getStaffRedemptions(staffId: string, page?: number, limit?: number, status?: RedemptionStatus): Promise<{
        redemptions: RedemptionResponseDto[];
        pagination: any;
    }>;
    getMerchantRedemptions(merchantId: string, page?: number, limit?: number, status?: RedemptionStatus, startDate?: Date, endDate?: Date): Promise<{
        redemptions: RedemptionResponseDto[];
        pagination: any;
    }>;
    getCustomerRedemptions(customerId: string, page?: number, limit?: number, status?: RedemptionStatus): Promise<{
        redemptions: RedemptionResponseDto[];
        pagination: any;
    }>;
    healthCheck(): Promise<{
        status: string;
        timestamp: Date;
        service: string;
    }>;
}
