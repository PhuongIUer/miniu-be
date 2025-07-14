import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SetRoleDto {
  @IsNumber()
  @ApiProperty({
    description: 'Role ID to set',
    example: 1
  })
  roleId: number;
} 