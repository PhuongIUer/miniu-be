import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LecturersService } from './lecturers.service';
import { Lecturer } from './entities/lecturer.entity';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';

@ApiTags('lecturers')
@Controller('lecturers')
export class LecturersController {
  constructor(private readonly lecturersService: LecturersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lecturer' })
  @ApiBody({ type: CreateLecturerDto })
  @ApiResponse({ status: 201, description: 'Lecturer created successfully', type: Lecturer })
  create(@Body() createLecturerDto: CreateLecturerDto): Promise<Lecturer> {
    return this.lecturersService.create(createLecturerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lecturers' })
  @ApiResponse({ status: 200, description: 'List of all lecturers', type: [Lecturer] })
  findAll(): Promise<Lecturer[]> {
    return this.lecturersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lecturer by ID' })
  @ApiResponse({ status: 200, description: 'Lecturer details', type: Lecturer })
  @ApiResponse({ status: 404, description: 'Lecturer not found' })
  findOne(@Param('id') id: string): Promise<Lecturer> {
    return this.lecturersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a lecturer' })
  @ApiBody({ type: UpdateLecturerDto })
  @ApiResponse({ status: 200, description: 'Lecturer updated successfully', type: Lecturer })
  update(@Param('id') id: string, @Body() updateLecturerDto: UpdateLecturerDto): Promise<Lecturer> {
    return this.lecturersService.update(+id, updateLecturerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lecturer' })
  @ApiResponse({ status: 200, description: 'Lecturer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lecturer not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.lecturersService.remove(+id);
  }
}