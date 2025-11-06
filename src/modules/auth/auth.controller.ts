import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser, Public } from './decorators/auth.decorators';
import type { AuthUser } from './types';
import { RegisterDto, OAuthGoogleDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Health check for auth service' })
  @ApiResponse({ status: 200, description: 'Auth service is running' })
  healthCheck() {
    return { status: 'ok', message: 'Auth service is running' };
  }

  @Public()
  @Post('verify')
  @ApiOperation({
    summary: 'Verify user credentials (NextAuth authorize support)',
  })
  @ApiResponse({ status: 200, description: 'Credentials valid' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Throttle({ short: { limit: 5, ttl: 60 } })
  async verifyCredentials(@Body() body: { email: string; password: string }) {
    return this.authService.verifyCredentials(body.email, body.password);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  @ApiResponse({ status: 400, description: 'Invalid registration data' })
  @Throttle({ short: { limit: 3, ttl: 60 } })
  async register(@Body() body: RegisterDto) {
    return this.authService.registerUser(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Returns user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@CurrentUser() user: AuthUser) {
    return this.authService.getProfile(user.id);
  }

  @Public()
  @Post('oauth/google')
  @ApiOperation({
    summary: 'Find or create user from Google OAuth (NextAuth support)',
  })
  @ApiResponse({
    status: 200,
    description: 'User found or created successfully',
  })
  @ApiResponse({ status: 401, description: 'Account is inactive' })
  @Throttle({ short: { limit: 10, ttl: 60 } })
  async oauthGoogle(@Body() body: OAuthGoogleDto) {
    return this.authService.findOrCreateOAuthUser(body);
  }
}
