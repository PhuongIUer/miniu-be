import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { MajorsService } from './majors.service';
import { Major } from './entities/major.entity';
import { CreateMajorDto } from './dto/create-major.dto';
import { UpdateMajorDto } from './dto/update-major.dto';

@ApiTags('majors')
@Controller('majors')
export class MajorsController {
  constructor(private readonly majorsService: MajorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new major' })
  @ApiBody({ type: CreateMajorDto })
  @ApiResponse({ status: 201, description: 'Major created successfully', type: Major })
  create(@Body() createMajorDto: CreateMajorDto): Promise<Major> {
    return this.majorsService.create(createMajorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all majors' })
  @ApiResponse({ status: 200, description: 'List of all majors', type: [Major] })
  findAll(): Promise<Major[]> {
    return this.majorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a major by ID' })
  @ApiResponse({ status: 200, description: 'Major details', type: Major })
  @ApiResponse({ status: 404, description: 'Major not found' })
  findOne(@Param('id') id: string): Promise<Major> {
    return this.majorsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a major' })
  @ApiBody({ type: UpdateMajorDto })
  @ApiResponse({ status: 200, description: 'Major updated successfully', type: Major })
  update(@Param('id') id: string, @Body() updateMajorDto: UpdateMajorDto): Promise<Major> {
    return this.majorsService.update(+id, updateMajorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a major' })
  @ApiResponse({ status: 200, description: 'Major deleted successfully' })
  @ApiResponse({ status: 404, description: 'Major not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.majorsService.remove(+id);
  }
}