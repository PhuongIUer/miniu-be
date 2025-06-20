import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateSemesterDto {
  @ApiProperty({
    description: 'Name of the semester',
    example: 'Fall 2023',
  })
  @IsString()
  semester_name: string;

  @ApiProperty({
    description: 'ID of the curriculum this semester belongs to',
    example: 1,
  })
  @IsNumber()
  curriculum_id: number;
}