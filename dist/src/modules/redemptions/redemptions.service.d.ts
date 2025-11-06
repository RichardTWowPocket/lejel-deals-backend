import { PrismaService } from '../../prisma/prisma.service';
import { QRCodeSecurityService } from '../qr-security/qr-security.service';
import { RedemptionResponseDto, RedemptionStatsDto, RedemptionAnalyticsDto, RedemptionValidationDto } from './dto/redemption.dto';
import { RedemptionStatus } from '@prisma/client';
export declare class RedemptionService {
    private prisma;
    private qrSecurityService;
    private readonly logger;
    constructor(prisma: PrismaService, qrSecurityService: QRCodeSecurityService);
    processRedemption(qrToken: string, redeemedByUserId: string, notes?: string, location?: string): Promise<RedemptionResponseDto>;
    findOne(id: string): Promise<RedemptionResponseDto>;
    findAll(page?: number, limit?: number, merchantId?: string, redeemedByUserId?: string, status?: RedemptionStatus, startDate?: Date, endDate?: Date): Promise<{
        redemptions: RedemptionResponseDto[];
        pagination: any;
    }>;
    updateStatus(id: string, status: RedemptionStatus, notes?: string): Promise<RedemptionResponseDto>;
    getRedemptionStats(merchantId?: string): Promise<RedemptionStatsDto>;
    getRedemptionAnalytics(merchantId?: string, startDate?: Date, endDate?: Date): Promise<RedemptionAnalyticsDto>;
    validateRedemption(qrToken: string, staffId: string): Promise<RedemptionValidationDto>;
    private getDailyRedemptions;
    private getHourlyRedemptions;
    private getTopPerformingStaff;
    private getRedemptionTrends;
    private getCustomerRedemptions;
    private mapToResponseDto;
}
