import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CurriculumService } from './services/curriculum.service';
import { CreateCurriculumDto, UpdateCurriculumDto, CurriculumResponseDto } from './dtos/curriculum.dto';
import RoleGuard from '../../core/guards/roles.guard';
import { ApiCurriculumResponse } from './decorators/api-curriculum-reponse.decorator';

@ApiTags('curricula')
@Controller('curricula')
@ApiBearerAuth('JWT-auth')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Post()
  @UseGuards(RoleGuard(['admin', 'curriculum-manager']))
  @ApiCurriculumResponse('create')
  async create(
    @Body() createCurriculumDto: CreateCurriculumDto
  ): Promise<CurriculumResponseDto> {
    return this.curriculumService.create(createCurriculumDto);
  }
   
  @Get('curriculum/:curriculumId')
  @ApiCurriculumResponse('findOne')
  async findOne(@Param('curriculumId') curriculumId: string): Promise<CurriculumResponseDto> {
    return this.curriculumService.findOne(+curriculumId);
  }

  @Patch(':id')
  @UseGuards(RoleGuard(['admin', 'curriculum-manager']))
  @ApiCurriculumResponse('update')
  async update(
    @Param('id') id: string,
    @Body() updateCurriculumDto: UpdateCurriculumDto
  ): Promise<CurriculumResponseDto> {
    return this.curriculumService.update(+id, updateCurriculumDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(['admin', 'curriculum-manager']))
  @ApiCurriculumResponse('remove')
  async remove(
    @Param('id') id: string
  ): Promise<void> {
    return this.curriculumService.remove(+id);
  }
}