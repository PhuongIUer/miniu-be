import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MajorService } from '../services/major.service';
import { CreateMajorDto, UpdateMajorDto, MajorResponseDto } from '../dtos/major.dto';
import RoleGuard from '../../../core/guards/roles.guard';
import { ApiMajorResponse } from '../decorators/api-major-reponse.decorator';

@ApiTags('majors')
@Controller('majors')
@ApiBearerAuth('JWT-auth')
export class MajorController {
  constructor(private readonly majorService: MajorService) {}

  @Post(':curriculumId')
  @UseGuards(RoleGuard(['admin']))
  @ApiMajorResponse('create')
  async create(
    @Body() createMajorDto: CreateMajorDto,
    @Param('curriculumId') curriculumId: number,
    ): Promise<MajorResponseDto> {
    return this.majorService.create(createMajorDto, curriculumId);
  }

  @Get('majors/:curriculumId')
  @ApiMajorResponse('findAll')
  async findAll(@Param('curriculumId') curriculumId: string): Promise<MajorResponseDto[]> {
    return this.majorService.findAll(+curriculumId);
  }

  @Get('findOne/:id')
  @ApiMajorResponse('findOne')
  async findOne(@Param('id') id: string): Promise<MajorResponseDto> {
    return this.majorService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RoleGuard(['admin']))
  @ApiMajorResponse('update')
  async update(
    @Param('id') id: string,
    @Body() updateMajorDto: UpdateMajorDto
  ): Promise<MajorResponseDto> {
    return this.majorService.update(+id, updateMajorDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(['admin']))
  @ApiMajorResponse('remove')
  async remove(@Param('id') id: string): Promise<void> {
    return this.majorService.remove(+id);
  }
}