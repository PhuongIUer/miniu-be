import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty({
    description: 'Name of the subject',
    example: 'Introduction to Programming',
  })
  @IsString()
  subject_name: string;

  @ApiProperty({
    description: 'Credit value of the subject',
    example: 3,
  })
  @IsNumber()
  subject_credit: number;

  @ApiProperty({
    description: 'ID of the semester this subject belongs to',
    example: 1,
  })
  @IsNumber()
  semester_id: number;
}