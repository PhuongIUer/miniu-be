import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSubjectDto, SubjectResponseDto } from './subject.dto';
import { ConcentrationResponseDto } from './concentration.dto';

export class CreateSemesterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

}

export class UpdateSemesterDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ type: [CreateSubjectDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubjectDto)
  @IsOptional()
  subjects?: CreateSubjectDto[];
}

export class SemesterResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: [SubjectResponseDto] })
  subjects: SubjectResponseDto[];
}