import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/roles.entity';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  initialiseTestTransactions,
  runInTransaction,
} from 'typeorm-test-transactions';
import { BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';

initialiseTestTransactions();

describe('Auth services', () => {
  const repositoryMockFactory = jest.fn(() => ({
    findOne: jest.fn((entity) => entity),
    find: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
  }));

  let jwtService: JwtService;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;
  let passwordService: PasswordService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'token'),
            verify: jest.fn()
          },
        },
        {
          provide: PasswordService,
          useValue: {
            hashPassword: jest.fn(),
            comparePassword: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Role),
          useFactory: repositoryMockFactory,
        },
        AuthService,
      ],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
    passwordService = module.get<PasswordService>(PasswordService);
    authService = module.get<AuthService>(AuthService);
  });

  const mockUsers = [
    {
      email: 'admin@gmail.com',
      password: '123456',
      role: {
        id: 1,
        description: 'Admin',
        name: 'admin',
      },
    },
  ];

  describe('Validate user', () => {
    it('should return user if user is valid', async () => {
      jest.spyOn(userRepository, 'findOne').mockImplementation(() => {
        return Promise.resolve(mockUsers[0] as User);
      });
      jest.spyOn(passwordService, 'comparePassword').mockResolvedValue(true);
      expect(await authService.validateUser('admin@gmail.com', '123456')).toEqual(
        mockUsers[0]
      );
    });

    it('should return null if user is invalid', async () => {
      jest.spyOn(userRepository, 'findOne').mockImplementation(() => {
        return Promise.resolve(null);
      });
      expect(
        await authService.validateUser('test@qkit.com', '123456')
      ).toBeNull();
    });
  });
  describe('Login', () => {
    const mockLoginDto = {
      email: 'admin@gmail.com',
      password: '123456',
    };
    it('should return access token if user is valid', async () => {
      jest
        .spyOn(authService, 'validateUser')
        .mockResolvedValue(mockUsers[0] as User);
      jest.spyOn(jwtService, 'sign').mockImplementation(() => 'token_123');
      expect(await authService.login(mockLoginDto)).toEqual({
        access_token: 'token_123',
      });
    });

    it('should throw error if user is invalid', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUsers[0] as User);
      await expect(authService.login(mockLoginDto)).rejects.toThrow(
        'Invalid credentials'
      );
    });

    it('should throw error if user is not verified', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue({
        ...mockUsers[0],
        isVerified: false,
      } as unknown as User);
      await expect(authService.login(mockLoginDto)).rejects.toThrow(
        'Email not verified. Please verify your email first.'
      );
    });
  });

  describe('Register', () => {
    const mockRegisterDto = {
      email: 'admin@gmail.com',
      password: '123456',
      userName: 'admin',
    };

    it('should return register response if user is valid', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(roleRepository, 'findOne')
        .mockResolvedValue({ name: 'student' } as Role);
      jest.spyOn(passwordService, 'hashPassword').mockResolvedValue('abcxyz');
      jest.spyOn(userRepository, 'save').mockResolvedValue({
        ...mockRegisterDto,
        role: { name: 'student' },
      } as User);
      runInTransaction(async () => {
        expect((await authService.register(mockRegisterDto)).message).toEqual(
          'Registration successful. Please check your email for verification code.'
        );
      });
    });

    it('should throw error if user already exists', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(mockUsers[0] as User);
      runInTransaction(async () => {
        await expect(authService.register(mockRegisterDto)).rejects.toThrow(
          new ConflictException('Email already exists')
        );
      });
    });
  });



  describe('Get profile', () => {
    it('should return user profile', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(mockUsers[0] as User);
      expect(await authService.getProfile(1)).toEqual(mockUsers[0]);
    });

    it('should throw error if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      await expect(authService.getProfile(1)).rejects.toThrow(
        new BadRequestException('User not found')
      );
    });
  });

  describe('Change password', () => {
    it('should return message if password is changed successfully', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUsers[0] as User);
      jest.spyOn(passwordService, 'comparePassword').mockResolvedValue(true);
      jest.spyOn(passwordService, 'hashPassword').mockResolvedValue('new_hashed_password');
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUsers[0] as User);
      expect(
        await authService.changePassword(1, {
          currentPassword: '123456',
          newPassword: 'new_password',
          confirmPassword: 'new_password'
        })
      ).toEqual({
        message: 'Password has been changed successfully'
      });
    })

    it('should throw error if new password and confirm password do not match', async () => {
      await expect(
        authService.changePassword(1, {
          currentPassword: '123456',
          newPassword: 'new_password',
          confirmPassword: 'different_password'
        })
      ).rejects.toThrow(new BadRequestException('New password and confirm password do not match'));
    })
  })
});
