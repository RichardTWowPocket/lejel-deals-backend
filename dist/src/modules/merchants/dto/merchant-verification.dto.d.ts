export declare enum VerificationStatus {
    PENDING = "PENDING",
    VERIFIED = "VERIFIED",
    REJECTED = "REJECTED",
    SUSPENDED = "SUSPENDED"
}
export declare class MerchantVerificationDto {
    status: VerificationStatus;
    notes?: string;
    requiredDocuments?: string[];
    submittedDocuments?: string[];
    verifiedAt?: string;
    verifiedBy?: string;
}
