import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean, IsObject, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MerchantRole } from '@prisma/client';

// StaffRole enum (mapped from MerchantRole for API compatibility)
export enum StaffRole {
  MANAGER = 'MANAGER',
  CASHIER = 'CASHIER',
  SUPERVISOR = 'SUPERVISOR',
  ADMIN = 'ADMIN',
}

// Helper function to map MerchantRole to StaffRole
export function mapMerchantRoleToStaffRole(merchantRole: MerchantRole): StaffRole {
  const mapping: Record<MerchantRole, StaffRole> = {
    [MerchantRole.OWNER]: StaffRole.ADMIN, // Owner maps to ADMIN
    [MerchantRole.ADMIN]: StaffRole.ADMIN,
    [MerchantRole.MANAGER]: StaffRole.MANAGER,
    [MerchantRole.SUPERVISOR]: StaffRole.SUPERVISOR,
    [MerchantRole.CASHIER]: StaffRole.CASHIER,
  };
  return mapping[merchantRole] || StaffRole.CASHIER;
}

// Helper function to map StaffRole to MerchantRole
export function mapStaffRoleToMerchantRole(staffRole: StaffRole): MerchantRole {
  const mapping: Record<StaffRole, MerchantRole> = {
    [StaffRole.ADMIN]: MerchantRole.ADMIN,
    [StaffRole.MANAGER]: MerchantRole.MANAGER,
    [StaffRole.SUPERVISOR]: MerchantRole.SUPERVISOR,
    [StaffRole.CASHIER]: MerchantRole.CASHIER,
  };
  return mapping[staffRole] || MerchantRole.CASHIER;
}

export class CreateStaffDto {
  @ApiProperty({ description: 'Staff first name', example: 'John' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ description: 'Staff last name', example: 'Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ description: 'Staff email address', example: 'john.doe@merchant.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'Staff phone number', example: '+6281234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: '4-6 digit PIN for authentication', example: '1234' })
  @IsString()
  @MinLength(4)
  @MaxLength(6)
  @Matches(/^\d+$/, { message: 'PIN must contain only digits' })
  pin: string;

  @ApiPropertyOptional({ description: 'Staff role', enum: StaffRole, example: StaffRole.CASHIER })
  @IsOptional()
  @IsEnum(StaffRole)
  role?: StaffRole;

  @ApiPropertyOptional({ description: 'Merchant ID for staff assignment' })
  @IsOptional()
  @IsString()
  merchantId?: string;

  @ApiPropertyOptional({ description: 'Staff permissions object' })
  @IsOptional()
  @IsObject()
  permissions?: any;

  @ApiPropertyOptional({ description: 'Additional staff metadata' })
  @IsOptional()
  @IsObject()
  metadata?: any;
}

export class UpdateStaffDto {
  @ApiPropertyOptional({ description: 'Staff first name', example: 'John' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @ApiPropertyOptional({ description: 'Staff last name', example: 'Doe' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @ApiPropertyOptional({ description: 'Staff email address', example: 'john.doe@merchant.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Staff phone number', example: '+6281234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: '4-6 digit PIN for authentication', example: '1234' })
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(6)
  @Matches(/^\d+$/, { message: 'PIN must contain only digits' })
  pin?: string;

  @ApiPropertyOptional({ description: 'Staff role', enum: StaffRole })
  @IsOptional()
  @IsEnum(StaffRole)
  role?: StaffRole;

  @ApiPropertyOptional({ description: 'Merchant ID for staff assignment' })
  @IsOptional()
  @IsString()
  merchantId?: string;

  @ApiPropertyOptional({ description: 'Staff permissions object' })
  @IsOptional()
  @IsObject()
  permissions?: any;

  @ApiPropertyOptional({ description: 'Additional staff metadata' })
  @IsOptional()
  @IsObject()
  metadata?: any;

  @ApiPropertyOptional({ description: 'Staff active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class StaffLoginDto {
  @ApiProperty({ description: 'Staff email or PIN', example: 'john.doe@merchant.com' })
  @IsString()
  identifier: string;

  @ApiProperty({ description: 'Staff PIN', example: '1234' })
  @IsString()
  @MinLength(4)
  @MaxLength(6)
  @Matches(/^\d+$/, { message: 'PIN must contain only digits' })
  pin: string;
}

export class StaffResponseDto {
  @ApiProperty({ description: 'Staff ID (MerchantMembership ID)' })
  id: string;

  @ApiProperty({ description: 'Staff first name' })
  firstName: string;

  @ApiProperty({ description: 'Staff last name' })
  lastName: string;

  @ApiProperty({ description: 'Staff email' })
  email: string;

  @ApiPropertyOptional({ description: 'Staff phone' })
  phone?: string;

  @ApiProperty({ description: 'Staff role', enum: StaffRole })
  role: StaffRole;

  @ApiProperty({ description: 'Staff active status' })
  isActive: boolean;

  @ApiPropertyOptional({ description: 'Last login timestamp' })
  lastLoginAt?: Date;

  @ApiPropertyOptional({ description: 'Merchant ID' })
  merchantId?: string;

  @ApiPropertyOptional({ description: 'Merchant information' })
  merchant?: {
    id: string;
    name: string;
    email: string;
  };

  @ApiPropertyOptional({ description: 'Staff permissions' })
  permissions?: any;

  @ApiPropertyOptional({ description: 'Staff metadata' })
  metadata?: any;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Last update timestamp' })
  updatedAt?: Date;
}

export class StaffLoginResponseDto {
  @ApiProperty({ description: 'Staff information' })
  staff: StaffResponseDto;

  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'Token expiration time' })
  expiresIn: number;
}

export class StaffStatsDto {
  @ApiProperty({ description: 'Total staff count' })
  totalStaff: number;

  @ApiProperty({ description: 'Active staff count' })
  activeStaff: number;

  @ApiProperty({ description: 'Staff by role' })
  staffByRole: {
    MANAGER: number;
    CASHIER: number;
    SUPERVISOR: number;
    ADMIN: number;
  };

  @ApiProperty({ description: 'Staff by merchant' })
  staffByMerchant: Array<{
    merchantId: string;
    merchantName: string;
    staffCount: number;
  }>;

  @ApiProperty({ description: 'Recent logins (last 24 hours)' })
  recentLogins: number;

  @ApiProperty({ description: 'Staff activity summary' })
  activitySummary: {
    totalRedemptions: number;
    averageRedemptionsPerStaff: number;
    mostActiveStaff: Array<{
      staffId: string;
      staffName: string;
      redemptions: number;
    }>;
  };
}

export class ChangePinDto {
  @ApiProperty({ description: 'Current PIN', example: '1234' })
  @IsString()
  @MinLength(4)
  @MaxLength(6)
  @Matches(/^\d+$/, { message: 'PIN must contain only digits' })
  currentPin: string;

  @ApiProperty({ description: 'New PIN', example: '5678' })
  @IsString()
  @MinLength(4)
  @MaxLength(6)
  @Matches(/^\d+$/, { message: 'PIN must contain only digits' })
  newPin: string;
}

export class StaffActivityDto {
  @ApiProperty({ description: 'Activity type', example: 'REDEMPTION' })
  activityType: string;

  @ApiProperty({ description: 'Activity description', example: 'Redeemed coupon for order ORD-123' })
  description: string;

  @ApiProperty({ description: 'Related entity ID', example: 'coupon-123' })
  entityId?: string;

  @ApiProperty({ description: 'Activity metadata' })
  metadata?: any;

  @ApiProperty({ description: 'Activity timestamp' })
  timestamp: Date;
}