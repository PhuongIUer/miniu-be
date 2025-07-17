import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/roles.entity';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from './password.service';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private passwordService: PasswordService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });

    if (!user) return null;

    const isPasswordValid = await this.passwordService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role.name, 
      jti: uuidv4() 
    };
    
   return {
      access_token: this.jwtService.sign(payload, { expiresIn: '3h' }),
    };
  }

  async logout(userId: number, jti: string) {
    return {
      message: 'Logout successful',
    };
  }

  async register(registerDto: RegisterDto) {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      // Find default role (assuming 'user' role exists)
      const role = await this.roleRepository.findOne({
        where: { name: 'user' }, // Changed from 'student' to 'user'
      });

      if (!role) {
        throw new InternalServerErrorException('Default role not found');
      }

      // Hash password
      const hashedPassword = await this.passwordService.hashPassword(
        registerDto.password,
        10,
      );

      // Create new user
      const newUser = this.userRepository.create({
        email: registerDto.email,
        password: hashedPassword,
        role: role,
      });

      const savedUser = await this.userRepository.save(newUser);

      return {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role.name,
        message: 'Registration successful',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
async deleteUser(userId: number ): Promise<{ message: string }> {
  try {
    // Find user by ID
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      relations: ['role']
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete user
    await this.userRepository.remove(user);

    return {
      message: 'User account has been deleted successfully'
    };
  } catch (error) {
    if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to delete user account');
  }
}

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New password and confirm password do not match');
    }

    // Check if new password is different from current password
    if (currentPassword === newPassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    // Find user by ID
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate current password
    const isPasswordValid = await this.passwordService.comparePassword(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await this.passwordService.hashPassword(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await this.userRepository.save(user);

    return {
      message: 'Password has been changed successfully',
    };
  }
}