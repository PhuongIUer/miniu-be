import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { SetRoleDto } from "../dtos/set-role.dto";
import { plainToInstance } from "class-transformer";
import { Logger } from "@nestjs/common";
import { Role } from "../../roles/entities/roles.entity";

@Injectable()
export class UsersService{
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ){}
  
async getUserByEmail(email: string) {
  const user = await this.userRepository.findOne({ 
    where: { email },
    relations: ['role']
  });
  
  if (!user) {
    throw new NotFoundException('User not found');
  }
  
  return user;
}
  async findAll(page, limit) {
    const skip = (page - 1) * limit;
    
    const [users, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      order: { id: 'ASC' },
      relations: ['role'],
    });

    return {
      items: users,
      meta: {
        totalItems: total,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async updateMe(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    
    this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async getUserById(userId: number) {
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      relations: ['role']
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  
  async updateUserById(userId: number, updateUserDto: UpdateUserDto) {
    // check user exist
    const user = await this.userRepository.findOne({ 
      where: { id: userId }
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    
    
    // update user
    this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async setRole(id: number, setRoleDto: SetRoleDto) {
    try {
      const [user, role] = await Promise.all([
        this.userRepository.findOne({
          where: { id },
          relations: ['role']
        }),
        this.roleRepository.findOne({
          where: { id: setRoleDto.roleId }
        })
      ]);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      // No allow change role of admin
      if (user.role.name === 'admin') {
        throw new BadRequestException('Cannot change admin role');
      }

      user.role = role;
      await this.userRepository.save(user);

    } catch (error) {
      this.logger.error(`Failed to set role for user: ${error.message}`);
      throw error;
    }
  }
}