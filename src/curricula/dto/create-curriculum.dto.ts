import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateCurriculumDto {
  @ApiProperty({
    description: 'Name of the curriculum',
    example: 'Computer Science 2023 Curriculum',
  })
  @IsString()
  curriculum_name: string;

  @ApiProperty({
    description: 'ID of the major this curriculum belongs to',
    example: 1,
  })
  @IsNumber()
  major_id: number;
}