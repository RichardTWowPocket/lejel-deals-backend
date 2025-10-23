import { PrismaService } from '../../prisma/prisma.service';
export interface QRCodePayload {
    couponId: string;
    orderId: string;
    dealId: string;
    customerId: string;
    merchantId: string;
    expiresAt: Date;
    issuedAt: Date;
    nonce: string;
}
export interface QRCodeValidationResult {
    isValid: boolean;
    payload?: QRCodePayload;
    error?: string;
    coupon?: any;
    order?: any;
    deal?: any;
    customer?: any;
    merchant?: any;
}
export declare class QRCodeSecurityService {
    private prisma;
    private readonly logger;
    private readonly qrSecret;
    private readonly qrExpirationHours;
    constructor(prisma: PrismaService);
    generateSecureQRCode(couponId: string): Promise<string>;
    validateQRCode(qrToken: string, staffId?: string): Promise<QRCodeValidationResult>;
    markQRCodeAsUsed(couponId: string, staffId: string, notes?: string): Promise<void>;
    revokeQRCode(couponId: string, reason: string): Promise<void>;
    getQRCodeHistory(couponId: string): Promise<any[]>;
    getQRCodeStats(): Promise<any>;
    private logQRActivity;
    cleanupExpiredQRCodes(): Promise<number>;
}
