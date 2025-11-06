import { IsEmail, IsString, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  name?: string;
}

export class UserProfileDto {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}

export class OAuthGoogleDto {
  @IsEmail()
  email: string;

  @IsString()
  providerId: string; // Google user ID

  @IsOptional()
  @IsString()
  name?: string; // Full name from Google

  @IsOptional()
  @IsString()
  avatar?: string; // Profile picture URL

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}
