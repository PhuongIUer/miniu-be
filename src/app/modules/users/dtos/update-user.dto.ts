import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString} from 'class-validator';

export class UpdateUserDto {

  @ApiProperty({ 
    required: false, 
    type: 'string' as any,
    description: 'Profile avatar image',
    format: 'binary'
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userName?: string;
} 