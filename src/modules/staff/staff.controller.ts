import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import {
  CreateStaffDto,
  UpdateStaffDto,
  StaffLoginDto,
  StaffResponseDto,
  StaffLoginResponseDto,
  StaffStatsDto,
  ChangePinDto,
  StaffActivityDto,
} from './dto/staff.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/auth.decorators';
import { UserRole, StaffRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Staff Management')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new staff member' })
  @ApiResponse({ status: 201, description: 'Staff created successfully', type: StaffResponseDto })
  async create(@Body() createStaffDto: CreateStaffDto): Promise<StaffResponseDto> {
    return this.staffService.create(createStaffDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get paginated list of staff members' })
  @ApiResponse({ status: 200, description: 'Staff list retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'merchantId', required: false, type: String, description: 'Filter by merchant ID' })
  @ApiQuery({ name: 'role', required: false, enum: StaffRole, description: 'Filter by staff role' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('merchantId') merchantId?: string,
    @Query('role') role?: StaffRole,
    @Query('isActive') isActive?: boolean,
  ): Promise<{ staff: StaffResponseDto[]; pagination: any }> {
    return this.staffService.findAll(page, limit, merchantId, role, isActive);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get staff statistics and analytics' })
  @ApiResponse({ status: 200, description: 'Staff statistics retrieved successfully', type: StaffStatsDto })
  async getStats(): Promise<StaffStatsDto> {
    return this.staffService.getStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get staff member by ID' })
  @ApiResponse({ status: 200, description: 'Staff retrieved successfully', type: StaffResponseDto })
  async findOne(@Param('id') id: string): Promise<StaffResponseDto> {
    return this.staffService.findOne(id);
  }

  @Get('email/:email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get staff member by email' })
  @ApiResponse({ status: 200, description: 'Staff retrieved successfully', type: StaffResponseDto })
  async findByEmail(@Param('email') email: string): Promise<StaffResponseDto> {
    return this.staffService.findByEmail(email);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update staff member' })
  @ApiResponse({ status: 200, description: 'Staff updated successfully', type: StaffResponseDto })
  async update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto): Promise<StaffResponseDto> {
    return this.staffService.update(id, updateStaffDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete staff member' })
  @ApiResponse({ status: 200, description: 'Staff deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.staffService.remove(id);
  }

  @Post('login')
  @ApiOperation({ summary: 'Staff login with email/PIN and PIN' })
  @ApiResponse({ status: 200, description: 'Staff logged in successfully', type: StaffLoginResponseDto })
  async login(@Body() loginDto: StaffLoginDto): Promise<StaffLoginResponseDto> {
    return this.staffService.login(loginDto);
  }

  @Post(':id/change-pin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change staff PIN' })
  @ApiResponse({ status: 200, description: 'PIN changed successfully' })
  async changePin(@Param('id') id: string, @Body() changePinDto: ChangePinDto): Promise<void> {
    return this.staffService.changePin(id, changePinDto);
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate staff member' })
  @ApiResponse({ status: 200, description: 'Staff deactivated successfully', type: StaffResponseDto })
  async deactivate(@Param('id') id: string): Promise<StaffResponseDto> {
    return this.staffService.deactivate(id);
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate staff member' })
  @ApiResponse({ status: 200, description: 'Staff activated successfully', type: StaffResponseDto })
  async activate(@Param('id') id: string): Promise<StaffResponseDto> {
    return this.staffService.activate(id);
  }

  @Get(':id/activity')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MERCHANT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get staff activity history' })
  @ApiResponse({ status: 200, description: 'Staff activity retrieved successfully', type: [StaffActivityDto] })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of activities to retrieve' })
  async getActivity(
    @Param('id') id: string,
    @Query('limit') limit?: number,
  ): Promise<StaffActivityDto[]> {
    return this.staffService.getStaffActivity(id, limit);
  }

  @Get('profile/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current staff profile' })
  @ApiResponse({ status: 200, description: 'Staff profile retrieved successfully', type: StaffResponseDto })
  async getProfile(@Request() req: any): Promise<StaffResponseDto> {
    const staffId = req.user.sub;
    return this.staffService.findOne(staffId);
  }

  @Patch('profile/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current staff profile' })
  @ApiResponse({ status: 200, description: 'Staff profile updated successfully', type: StaffResponseDto })
  async updateProfile(@Request() req: any, @Body() updateStaffDto: UpdateStaffDto): Promise<StaffResponseDto> {
    const staffId = req.user.sub;
    return this.staffService.update(staffId, updateStaffDto);
  }

  @Post('profile/me/change-pin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change current staff PIN' })
  @ApiResponse({ status: 200, description: 'PIN changed successfully' })
  async changeMyPin(@Request() req: any, @Body() changePinDto: ChangePinDto): Promise<void> {
    const staffId = req.user.sub;
    return this.staffService.changePin(staffId, changePinDto);
  }
}



