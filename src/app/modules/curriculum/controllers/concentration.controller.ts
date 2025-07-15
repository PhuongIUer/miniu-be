import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ConcentrationService } from '../services/concentration.service';
import { CreateConcentrationDto, UpdateConcentrationDto, ConcentrationResponseDto } from '../dtos/concentration.dto';
import RoleGuard from '../../../core/guards/roles.guard';
import { ApiConcentrationResponse } from '../decorators/api-concentration-reponse.decorator';

@ApiTags('concentrations')
@Controller('concentrations')
@ApiBearerAuth('JWT-auth')
export class ConcentrationController {
  constructor(private readonly concentrationService: ConcentrationService) {}

  @Post(':majorId')
  @UseGuards(RoleGuard(['admin']))
  @ApiConcentrationResponse('create')
  async create(
    @Param('majorId') majorId: number,
    @Body() createConcentrationDto: CreateConcentrationDto
    ): Promise<ConcentrationResponseDto> {
    console.log('Creating concentration with DTO:', createConcentrationDto, 'for major ID:', majorId);
    return this.concentrationService.create(createConcentrationDto, majorId);
  }

  @Get('findAll/:majorId')
  @ApiConcentrationResponse('findAll')
  async findAll(@Param('majorId') majorId: string): Promise<ConcentrationResponseDto[]> {
    return this.concentrationService.findAll(+majorId);
  }

  @Get('findOne/:id')
  @ApiConcentrationResponse('findOne')
  async findOne(@Param('id') id: string): Promise<ConcentrationResponseDto> {
    return this.concentrationService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RoleGuard(['admin']))
  @ApiConcentrationResponse('update')
  async update(
    @Param('id') id: string,
    @Body() updateConcentrationDto: UpdateConcentrationDto
  ): Promise<ConcentrationResponseDto> {
    return this.concentrationService.update(+id, updateConcentrationDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(['admin']))
  @ApiConcentrationResponse('remove')
  async remove(
    @Param('id') id: string
    ): Promise<void> {
    return this.concentrationService.remove(+id);
  }
}