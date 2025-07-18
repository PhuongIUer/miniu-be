import { Body, Controller, Get, Param, Put, Req, UseGuards, ParseIntPipe, Query, Patch, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import RoleGuard from '../../core/guards/roles.guard';
import { UsersService } from './services/users.service';
import { Serialize } from '../../core/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PaginatedUsersDto } from './dtos/pagination.dto';
import { QueryBaseInput } from '../../common/inputs/query-base.input';
import { SetRoleDto } from './dtos/set-role.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileToUrlInterceptor } from '../../core/interceptors/file-to-url.interceptor';
import { avatarUploadConfig } from '../../config/multer.config';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Serialize(PaginatedUsersDto)
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'page', description: 'number of page', required: false, type: Number })
  @ApiQuery({ name: 'limit', description: 'number of item per page', required: false, type: Number })
  findAll(
    // @Query('page') page = 1,
    // @Query('limit') limit = 10
    @Query() query : QueryBaseInput
  ) {
    return this.usersService.findAll(+query.page, +query.limit);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('current-profile')
  @UseInterceptors(FileInterceptor('avatar', avatarUploadConfig), FileToUrlInterceptor)
  @Serialize(UserDto)
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Profile updated successfully', type: UserDto })
  updateProfile(@Body() body: UpdateUserDto, @Req() request) {
    const userId = request.user.id;
    return this.usersService.updateMe(userId, body);
  }
  
  @UseGuards(RoleGuard(['admin']))
  @Get('email/:email')
  @Serialize(UserDto)
  @ApiOperation({ summary: 'Get user by email (admin only)' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'email', description: 'User email to search' })
  getUserByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @UseGuards(RoleGuard(['admin']))
  @Patch(':id/profile')
  @UseInterceptors(FileInterceptor('avatar', avatarUploadConfig), FileToUrlInterceptor)
  @Serialize(UserDto)
  @ApiOperation({ summary: 'Update any user profile (admin only)' })
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'User ID to update' })
  updateUserProfile(
    @Param('id', ParseIntPipe) userId: number, 
    @Body() updateUserDto: UpdateUserDto, 
  ) {

    return this.usersService.updateUserById(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @Serialize(UserDto)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiBearerAuth('JWT-auth')
  getUserById(@Param('id', ParseIntPipe) userId: number) {
    return this.usersService.getUserById(userId);
  }

  @UseGuards(RoleGuard(['admin']))
  @Patch(':id/role')
  @ApiOperation({ summary: 'Set user role (admin only)' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'User ID to set role' })
  setRole(
    @Param('id', ParseIntPipe) userId: number,
    @Body() setRoleDto: SetRoleDto
  ) {
    return this.usersService.setRole(userId, setRoleDto);
  }
  

} 