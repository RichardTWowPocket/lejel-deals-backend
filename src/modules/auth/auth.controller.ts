import { Controller, Get, UseGuards, Post, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser, Public } from './decorators/auth.decorators';
import type { AuthUser } from './types';
import { RegisterDto } from './dto/auth.dto';

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

  // Login and register are handled by NextAuth on the frontend

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Returns user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@CurrentUser() user: AuthUser) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      metadata: user.user_metadata,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh authentication token' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refreshToken(@CurrentUser() user: AuthUser) {
    // In a real implementation, you might want to generate a new token
    // For now, we'll just return the current user info
    return {
      message: 'Token is valid',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Public()
  @Post('verify')
  @HttpCode(200)
  @ApiOperation({ summary: 'Verify user credentials (NextAuth authorize support)' })
  @ApiResponse({ status: 200, description: 'Credentials valid' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async verify(@Body() body: { email: string; password: string }) {
    return this.authService.verifyCredentials(body.email, body.password);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  @ApiResponse({ status: 400, description: 'Invalid registration data' })
  async register(@Body() body: RegisterDto) {
    return this.authService.registerUser(body);
  }
}