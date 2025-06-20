import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMajorDto {
  @ApiProperty()
  @IsString()
  major_name: string;
}