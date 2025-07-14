import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { initialiseTestTransactions } from 'typeorm-test-transactions';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { NotFoundException } from '@nestjs/common';

describe('User Service', () => {
  initialiseTestTransactions();
  let userService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: {
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            merge: jest.fn(),
            save: jest.fn(),
          },
        },
        UsersService,
      ],
    }).compile();
    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });
  const users = [
    {
      id: 1,
      email: 'john@qkit.com',
      userName: 'john',
      password: '123456',
      role: { id: 1, name: 'admin'},
    },
    {
      id: 2,
      email: 'jane@qkit.com',
      userName: 'john',
      password: '123456',
      role: { id: 2, name: 'student'},
    },
  ];
  describe('Find all', () => {
    it('should return paginated users', async () => {
      jest.spyOn(userRepository, 'findAndCount').mockImplementation(() => {
        return Promise.resolve([users as User[], 2]);
      });
      const result = await userService.findAll(1, 10);
      expect(result).toEqual({
        items: users,
        meta: {
          currentPage: 1,
          itemsPerPage: 10,
          totalPages: 1,
          totalItems: 2,
        },
      });
    });
    it('should return empty array when no users found', async () => {
      jest.spyOn(userRepository, 'findAndCount').mockImplementation(() => {
        return Promise.resolve([[], 0]);
      });
      const result = await userService.findAll(1, 10);
      expect(result).toEqual({
        items: [],
        meta: {
          currentPage: 1,
          itemsPerPage: 10,
          totalPages: 0,
          totalItems: 0,
        },
      });
    });
  });

  describe('update me', () => {
    it('should update user', async () => {
      const userId = 1;
      const updateUserDto = { email: 'admin@gmail.com' };
      jest.spyOn(userRepository, 'findOne').mockImplementation(() => {
        return Promise.resolve(users[0] as User);
      });
      jest.spyOn(userRepository, 'merge').mockImplementation(() => {
        users[0].email = updateUserDto.email;
        return users[0] as User;
      });

      jest.spyOn(userRepository, 'save').mockImplementation(() => {
        return Promise.resolve(users[0] as User);
      });
      expect(
        (await userService.updateMe(userId, updateUserDto as UpdateUserDto))
          .email
      ).toEqual(updateUserDto.email);
    });

    it('should throw error when user not found', async () => {
      const userId = 1;
      const updateUserDto = { email: 'admin@gmail.com' };
      jest.spyOn(userRepository, 'findOne').mockImplementation(() => {
        return Promise.resolve(null);
      });
      await expect(
        userService.updateMe(userId, updateUserDto as UpdateUserDto)
      ).rejects.toThrow('User not found');
    });
  });

  describe('get user by id', () => {
    it('should return user', async () => {
      const userId = 1;
      jest.spyOn(userRepository, 'findOne').mockImplementation(() => {
        return Promise.resolve(users[0] as User);
      });
      expect(await userService.getUserById(userId)).toEqual(users[0]);
    });

    it('should throw error when user not found', async () => {
      const userId = 1;
      jest.spyOn(userRepository, 'findOne').mockImplementation(() => {
        return Promise.resolve(null);
      });
      await expect(userService.getUserById(userId)).rejects.toThrow(
        'User not found'
      );
    });
  });
  describe('update user by id', () => {
    it('should update user', async () => {
      const userId = 2;
      const updateUserDto = { email: 'admin@gmail.com' };

      jest.spyOn(userRepository, 'findOne').mockImplementation(() => {
        return Promise.resolve(users[1] as User);
      });

      jest.spyOn(userRepository, 'merge').mockImplementation(() => {
        users[1].email = updateUserDto.email;
        return users[1] as User;
      });
      jest.spyOn(userRepository, 'save').mockImplementation(() => {
        return Promise.resolve(users[1] as User);
      });
      expect(
        (
          await userService.updateUserById(
            userId,
            updateUserDto as UpdateUserDto
          )
        ).email
      ).toEqual(updateUserDto.email);
    });

    it('should throw error when user not found', async () => {
      const userId = 3;
      jest
        .spyOn(userRepository, 'findOne')
        .mockReturnValue(null as unknown as Promise<User>);
      await expect(
        userService.updateUserById(userId, {} as UpdateUserDto)
      ).rejects.toThrow(
        new NotFoundException(`User with ID ${userId} not found`)
      );
    });
  });
});
