import { CouponsService } from './coupons.service';
import { CouponResponseDto, CouponValidationDto, CouponValidationResponseDto, RedeemCouponDto, CancelCouponDto, CouponStatsDto, GenerateQRCodeDto } from './dto/coupon.dto';
import { CouponStatus } from '@prisma/client';
export declare class CouponsController {
    private readonly couponsService;
    constructor(couponsService: CouponsService);
    findAll(page?: number, limit?: number, status?: CouponStatus, orderId?: string, dealId?: string): Promise<{
        coupons: CouponResponseDto[];
        pagination: any;
    }>;
    findMine(user: any, page?: number, limit?: number, status?: CouponStatus): Promise<{
        coupons: CouponResponseDto[];
        pagination: any;
    }>;
    getStats(): Promise<CouponStatsDto>;
    findByOrder(orderId: string): Promise<CouponResponseDto[]>;
    findByQRCode(qrCode: string): Promise<CouponResponseDto>;
    findOne(id: string): Promise<CouponResponseDto>;
    validateCoupon(validationDto: CouponValidationDto): Promise<CouponValidationResponseDto>;
    redeemCoupon(redeemDto: RedeemCouponDto): Promise<CouponResponseDto>;
    expireCoupons(): Promise<{
        message: string;
        expiredCount: number;
    }>;
    generateQRCode(generateDto: GenerateQRCodeDto): Promise<{
        qrCode: string;
    }>;
    cancelCoupon(id: string, cancelDto: CancelCouponDto): Promise<CouponResponseDto>;
}
