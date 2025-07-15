import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSemesterDto, SemesterResponseDto } from './semester.dto';

export class CreateConcentrationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

}

export class UpdateConcentrationDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ type: [CreateSemesterDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSemesterDto)
  @IsOptional()
  semesters?: CreateSemesterDto[];
}

export class ConcentrationResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: [SemesterResponseDto] })
  semesters: SemesterResponseDto[];
}