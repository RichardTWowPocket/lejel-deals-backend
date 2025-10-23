import { QRCodeSecurityService } from './qr-security.service';
import { GenerateQRCodeDto, ValidateQRCodeDto, RedeemQRCodeDto, RevokeQRCodeDto, QRCodeResponseDto, QRCodeValidationResponseDto, QRCodeStatsDto, QRCodeHistoryDto } from './dto/qr-security.dto';
export declare class QRCodeSecurityController {
    private readonly qrSecurityService;
    constructor(qrSecurityService: QRCodeSecurityService);
    generateQRCode(generateQRCodeDto: GenerateQRCodeDto): Promise<QRCodeResponseDto>;
    validateQRCode(validateQRCodeDto: ValidateQRCodeDto): Promise<QRCodeValidationResponseDto>;
    redeemQRCode(redeemQRCodeDto: RedeemQRCodeDto): Promise<{
        success: boolean;
        message: string;
    }>;
    revokeQRCode(revokeQRCodeDto: RevokeQRCodeDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getQRCodeStats(): Promise<QRCodeStatsDto>;
    getQRCodeHistory(couponId: string): Promise<QRCodeHistoryDto>;
    cleanupExpiredQRCodes(): Promise<{
        success: boolean;
        cleanedCount: number;
        message: string;
    }>;
    validateQRCodeByToken(qrToken: string, staffId?: string): Promise<QRCodeValidationResponseDto>;
    healthCheck(): Promise<{
        status: string;
        timestamp: Date;
        service: string;
    }>;
}
