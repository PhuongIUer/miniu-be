import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SemesterService } from '../services/semester.service';
import { CreateSemesterDto, UpdateSemesterDto, SemesterResponseDto } from '../dtos/semester.dto';
import RoleGuard from '../../../core/guards/roles.guard';
import { ApiSemesterResponse } from '../decorators/api-semester-reponse.decorator';

@ApiTags('semesters')
@Controller('semesters')
@ApiBearerAuth('JWT-auth')
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Post(':concentrationId')
  @UseGuards(RoleGuard(['admin']))
  @ApiSemesterResponse('create')
  async create(
    @Param('concentrationId') concentrationId: number,
    @Body() createSemesterDto: CreateSemesterDto
    ): Promise<SemesterResponseDto> {
    console.log('Creating semester with DTO:', createSemesterDto, 'for concentration ID:', concentrationId);
    return this.semesterService.create(createSemesterDto, concentrationId);
  }

  @Get('findAll/:concentrationId')
  @ApiSemesterResponse('findAll')
  async findAll(
    @Param('concentrationId') concentrationId: string
  ): Promise<SemesterResponseDto[]> {
    return this.semesterService.findAll(+concentrationId);
  }
  @Get('findOne/:id')
  @ApiSemesterResponse('findOne')
  async findOne(@Param('id') id: string): Promise<SemesterResponseDto> {
    return this.semesterService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RoleGuard(['admin']))
  @ApiSemesterResponse('update')
  async update(
    @Param('id') id: string,
    @Body() updateSemesterDto: UpdateSemesterDto
  ): Promise<SemesterResponseDto> {
    return this.semesterService.update(+id, updateSemesterDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(['admin']))
  @ApiSemesterResponse('remove')
  async remove(
    @Param('id') id: string
    ): Promise<void> {
        return this.semesterService.remove(+id);
  }
}