import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { CreateMajorDto, MajorResponseDto } from './major.dto';

export class CreateCurriculumDto {
  @ApiProperty({
    description: 'Curriculum name',
    example: 'New Curriculum'
  })
  @IsString()
  @IsNotEmpty({ message: 'Name of the curriculum is required' })
  name: string;

}

export class UpdateCurriculumDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ type: [CreateMajorDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMajorDto)
  @IsOptional()
  majors?: CreateMajorDto[];
}

export class CurriculumResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: [MajorResponseDto] })
  majors: MajorResponseDto[];
}


