import { IsString, IsEmail, IsOptional, IsBoolean, IsArray, IsObject, ValidateNested, IsPhoneNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class OperatingHoursDto {
  @ApiProperty({ description: 'Day of the week', example: 'monday' })
  @IsString()
  day: string;

  @ApiProperty({ description: 'Opening time', example: '09:00' })
  @IsString()
  openTime: string;

  @ApiProperty({ description: 'Closing time', example: '22:00' })
  @IsString()
  closeTime: string;

  @ApiProperty({ description: 'Is open on this day', example: true })
  @IsBoolean()
  isOpen: boolean;
}

export class CreateMerchantDto {
  @ApiProperty({ description: 'Merchant name', example: 'Demo Restaurant' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Merchant description', example: 'A sample restaurant for testing' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Merchant email', example: 'demo@merchant.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'Merchant phone number', example: '+6281234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Merchant address', example: 'Jl. Demo No. 123' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'City', example: 'Jakarta' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Province', example: 'DKI Jakarta' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({ description: 'Postal code', example: '12345' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({ description: 'Website URL', example: 'https://demo-restaurant.com' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ description: 'Logo URL', example: 'https://via.placeholder.com/200x200' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({ description: 'Merchant images URLs', example: ['https://via.placeholder.com/400x300'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ description: 'Operating hours', type: [OperatingHoursDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OperatingHoursDto)
  operatingHours?: OperatingHoursDto[];

  @ApiPropertyOptional({ description: 'Is merchant active', example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}



