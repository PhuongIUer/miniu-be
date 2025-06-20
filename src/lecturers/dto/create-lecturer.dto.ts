import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsArray } from 'class-validator';

export class CreateLecturerDto {
  @ApiProperty()
  @IsString()
  lecturer_name: string;

  @ApiProperty()
  @IsEmail()
  lecturer_email: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  lecturer_position: string[];

  @ApiProperty({ required: false })
  lecturer_avturl?: string;

  @ApiProperty()
  major_id: number;
}