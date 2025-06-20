import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SemestersService } from './semesters.service';
import { Semester } from './entities/semester.entity';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';

@ApiTags('semesters')
@Controller('semesters')
export class SemestersController {
  constructor(private readonly semestersService: SemestersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new semester' })
  @ApiBody({ type: CreateSemesterDto })
  @ApiResponse({ status: 201, description: 'Semester created successfully', type: Semester })
  create(@Body() createSemesterDto: CreateSemesterDto): Promise<Semester> {
    return this.semestersService.create(createSemesterDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all semesters' })
  @ApiResponse({ status: 200, description: 'List of all semesters', type: [Semester] })
  findAll(): Promise<Semester[]> {
    return this.semestersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a semester by ID' })
  @ApiResponse({ status: 200, description: 'Semester details', type: Semester })
  @ApiResponse({ status: 404, description: 'Semester not found' })
  findOne(@Param('id') id: string): Promise<Semester> {
    return this.semestersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a semester' })
  @ApiBody({ type: UpdateSemesterDto })
  @ApiResponse({ status: 200, description: 'Semester updated successfully', type: Semester })
  update(@Param('id') id: string, @Body() updateSemesterDto: UpdateSemesterDto): Promise<Semester> {
    return this.semestersService.update(+id, updateSemesterDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a semester' })
  @ApiResponse({ status: 200, description: 'Semester deleted successfully' })
  @ApiResponse({ status: 404, description: 'Semester not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.semestersService.remove(+id);
  }
}