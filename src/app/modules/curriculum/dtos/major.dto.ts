import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateConcentrationDto, ConcentrationResponseDto } from './concentration.dto';

export class CreateMajorDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

}

export class UpdateMajorDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ type: [CreateConcentrationDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateConcentrationDto)
  @IsOptional()
  concentrations?: CreateConcentrationDto[];
}

export class MajorResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: [ConcentrationResponseDto] })
  concentrations: ConcentrationResponseDto[];
}