import { Controller, Post, Body, Get, UseGuards, Request, Param, Delete } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation,
  ApiBearerAuth, 
} from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { LocalAuthenticationGuard } from '../../core/guards/local-auth.guard';
import { Serialize } from '../../core/interceptors/serialize.interceptor';
import { ParseEmailPipe } from '../../core/pipes/parse-email.pipe';
import { RegisterResponseDto } from './dto/register-response.dto';
import { UserDto } from '../users/dtos/user.dto';
import { ApiAuthResponse } from './decorators/api-auth.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import RoleGuard from '../../core/guards/roles.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiAuthResponse('login')
  @UseGuards(LocalAuthenticationGuard)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiAuthResponse('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async logout(@Request() req) {
    return this.authService.logout(req.user.id, req.user.jti);
  }
  
  @Post('register')
  @ApiOperation({ summary: 'Register new user (Admin only)' }) 
  @ApiAuthResponse('register')
  @Serialize(RegisterResponseDto)
  @UseGuards(JwtAuthGuard, RoleGuard(['admin']))
  @ApiBearerAuth('JWT-auth') 
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiAuthResponse('profile')
  @UseGuards(JwtAuthGuard)
  @Serialize(UserDto)
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change password for logged in user' })
  @ApiAuthResponse('changePassword')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req
  ) {
    return this.authService.changePassword(req.user.id, changePasswordDto);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @UseGuards(JwtAuthGuard, RoleGuard(['admin']))
  @ApiBearerAuth('JWT-auth')
  async deleteUser(
  @Param('id') userId: number,
) {
  return this.authService.deleteUser(userId);
}
} 