import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsObject,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NotificationPreferencesDto {
  @ApiProperty({ description: 'Email notifications enabled', example: true })
  @IsBoolean()
  email: boolean;

  @ApiProperty({ description: 'SMS notifications enabled', example: true })
  @IsBoolean()
  sms: boolean;

  @ApiProperty({ description: 'Push notifications enabled', example: true })
  @IsBoolean()
  push: boolean;

  @ApiProperty({
    description: 'WhatsApp notifications enabled',
    example: false,
  })
  @IsBoolean()
  whatsapp: boolean;

  @ApiProperty({ description: 'Deal notifications enabled', example: true })
  @IsBoolean()
  deals: boolean;

  @ApiProperty({ description: 'Order notifications enabled', example: true })
  @IsBoolean()
  orders: boolean;

  @ApiProperty({
    description: 'Marketing notifications enabled',
    example: false,
  })
  @IsBoolean()
  marketing: boolean;
}

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Customer email',
    example: 'customer@example.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Customer phone number',
    example: '+6281234567890',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'First name', example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Last name', example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Date of birth',
    example: '1990-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: 'Customer preferences',
    type: NotificationPreferencesDto,
  })
  @IsOptional()
  @IsObject()
  preferences?: NotificationPreferencesDto;

  @ApiPropertyOptional({ description: 'Is customer active', example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: { source: 'web', referrer: 'google' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
