import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CurriculaService } from './curricula.service';
import { Curriculum } from './entities/curriculum.entity';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';

@ApiTags('curricula')
@Controller('curricula')
export class CurriculaController {
  constructor(private readonly curriculaService: CurriculaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new curriculum' })
  @ApiBody({ type: CreateCurriculumDto })
  @ApiResponse({ status: 201, description: 'Curriculum created successfully', type: Curriculum })
  create(@Body() createCurriculumDto: CreateCurriculumDto): Promise<Curriculum> {
    return this.curriculaService.create(createCurriculumDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all curricula' })
  @ApiResponse({ status: 200, description: 'List of all curricula', type: [Curriculum] })
  findAll(): Promise<Curriculum[]> {
    return this.curriculaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a curriculum by ID' })
  @ApiResponse({ status: 200, description: 'Curriculum details', type: Curriculum })
  @ApiResponse({ status: 404, description: 'Curriculum not found' })
  findOne(@Param('id') id: string): Promise<Curriculum> {
    return this.curriculaService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a curriculum' })
  @ApiBody({ type: UpdateCurriculumDto })
  @ApiResponse({ status: 200, description: 'Curriculum updated successfully', type: Curriculum })
  update(@Param('id') id: string, @Body() updateCurriculumDto: UpdateCurriculumDto): Promise<Curriculum> {
    return this.curriculaService.update(+id, updateCurriculumDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a curriculum' })
  @ApiResponse({ status: 200, description: 'Curriculum deleted successfully' })
  @ApiResponse({ status: 404, description: 'Curriculum not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.curriculaService.remove(+id);
  }
}