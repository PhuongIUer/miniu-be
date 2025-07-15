import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Concentration } from '../entities/concentration.entity';
import { Semester } from '../entities/semester.entity';
import { Major } from '../entities/major.entity';
import { CreateConcentrationDto, UpdateConcentrationDto, ConcentrationResponseDto } from '../dtos/concentration.dto';
import { plainToInstance } from 'class-transformer';
import { SemesterService } from './semester.service';

@Injectable()
export class ConcentrationService {
  constructor(
    @InjectRepository(Major)
    private readonly majorRepository: Repository<Major>,
    @InjectRepository(Concentration)
    private readonly concentrationRepository: Repository<Concentration>,
    @InjectRepository(Semester)
    private readonly semesterRepository: Repository<Semester>,
    private readonly semesterService: SemesterService,
  ) {}

  async create(
    createConcentrationDto: CreateConcentrationDto,
    majorId: number
  ): Promise<ConcentrationResponseDto> {
    const major = await this.majorRepository.findOne({
      where: { id: majorId }
    });

    if (!major) {
      throw new BadRequestException(`Major with ID ${majorId} does not exist`);
    }

    const concentration = this.concentrationRepository.create({
      ...createConcentrationDto,
      major
    });

    const savedConcentration = await this.concentrationRepository.save(concentration);
    return this.findOne(savedConcentration.id);
  }
  async findAllByMajorId(majorId: number): Promise<Concentration[]> {
    const concentrations = await this.concentrationRepository.find({
      where: { major: { id: majorId } },
    });

    // Get semesters for each concentration
    const concentrationsWithSemesters = await Promise.all(
      concentrations.map(async (concentration) => {
        const semesters = await this.semesterService.findAllByConcentrationId(concentration.id);
        return {
          ...concentration,
          semesters,
        };
      })
    );

    return concentrationsWithSemesters;
  }
  async findAll(majorId: number): Promise<ConcentrationResponseDto[]> {
    const concentrations = await this.concentrationRepository.find({ 
      where: { major: { id: majorId }},
      relations: ['semesters'] 
    });
    return plainToInstance(ConcentrationResponseDto, concentrations);
  }

  async findOne(id: number): Promise<ConcentrationResponseDto> {
    const concentration = await this.concentrationRepository.findOne({ 
      where: { id },
      relations: ['major']
    });
    if (!concentration) {
      throw new NotFoundException(`Concentration with ID ${id} not found`);
    }
    return plainToInstance(ConcentrationResponseDto, {
      ...concentration,
      majorId: concentration.major.id
    });
  }

  async update(id: number, updateConcentrationDto: UpdateConcentrationDto): Promise<ConcentrationResponseDto> {
    const concentration = await this.concentrationRepository.findOne({ 
      where: { id },
      relations: ['major']
    });
    if (!concentration) {
      throw new NotFoundException(`Concentration with ID ${id} not found`);
    }

    Object.assign(concentration, updateConcentrationDto)
    await this.concentrationRepository.save(concentration);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const concentration = await this.concentrationRepository.findOne({ 
      where: { id },
      relations: ['major', 'semesters']
    });

    if (!concentration) {
      throw new NotFoundException(`Concentration with ID ${id} not found`);
    }

    // Remove semesters and their nested entities first
    await this.semesterRepository.remove(concentration.semesters);
    await this.concentrationRepository.remove(concentration);
  }
}