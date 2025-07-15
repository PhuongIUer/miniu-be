import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SubjectService } from '../services/subject.service';
import { CreateSubjectDto, UpdateSubjectDto, SubjectResponseDto } from '../dtos/subject.dto';
import RoleGuard from '../../../core/guards/roles.guard';
import { ApiSubjectResponse } from '../decorators/api-subject-response.decorator';

@ApiTags('subjects')
@Controller('subjects')
@ApiBearerAuth('JWT-auth')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post(':semesterId')
  @UseGuards(RoleGuard(['admin']))
  @ApiSubjectResponse('create')
  async create(
    @Param('semesterId') semesterId: number,
    @Body() createSubjectDto: CreateSubjectDto
  ): Promise<SubjectResponseDto> {
    return this.subjectService.create(createSubjectDto, semesterId);
  }

  @Get('findAll/:semesterId')
  @ApiSubjectResponse('findAll')
  async findAll(
    @Param('semesterId') semesterId: string
  ): Promise<SubjectResponseDto[]> {
    return this.subjectService.findAll(+semesterId);
  }

  @Get('findOne/:id')
  @ApiSubjectResponse('findOne')
  async findOne(@Param('id') id: string): Promise<SubjectResponseDto> {
    return this.subjectService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RoleGuard(['admin']))
  @ApiSubjectResponse('update')
  async update(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto
  ): Promise<SubjectResponseDto> {
    return this.subjectService.update(+id, updateSubjectDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(['admin']))
  @ApiSubjectResponse('remove')
  async remove(
    @Param('id') id: string
  ): Promise<void> {
    return this.subjectService.remove(+id);
  }
}