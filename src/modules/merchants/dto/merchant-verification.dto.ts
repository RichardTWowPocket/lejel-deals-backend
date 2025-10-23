import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED'
}

export class MerchantVerificationDto {
  @ApiProperty({ description: 'Verification status', enum: VerificationStatus, example: VerificationStatus.PENDING })
  @IsEnum(VerificationStatus)
  status: VerificationStatus;

  @ApiPropertyOptional({ description: 'Verification notes', example: 'Documents verified successfully' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Required documents', example: ['business_license', 'tax_id', 'bank_account'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredDocuments?: string[];

  @ApiPropertyOptional({ description: 'Submitted documents', example: ['business_license.pdf', 'tax_id.pdf'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  submittedDocuments?: string[];

  @ApiPropertyOptional({ description: 'Verification date', example: '2024-01-01T00:00:00.000Z' })
  @IsOptional()
  @IsString()
  verifiedAt?: string;

  @ApiPropertyOptional({ description: 'Verified by admin ID', example: 'admin-123' })
  @IsOptional()
  @IsString()
  verifiedBy?: string;
}



