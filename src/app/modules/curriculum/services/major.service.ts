import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Major } from '../entities/major.entity';
import { Concentration } from '../entities/concentration.entity';
import { CreateMajorDto, UpdateMajorDto, MajorResponseDto } from '../dtos/major.dto';
import { plainToInstance } from 'class-transformer';
import { ConcentrationService } from './concentration.service';
import { Curriculum } from '../entities/curriculum.entity';

@Injectable()
export class MajorService {
  constructor(
    @InjectRepository(Curriculum)
    private readonly curriculumRepository: Repository<Curriculum>,
    @InjectRepository(Major)
    private readonly majorRepository: Repository<Major>,
    @InjectRepository(Concentration)
    private readonly concentrationRepository: Repository<Concentration>,
    private readonly concentrationService: ConcentrationService,
  ) {}

  async create(
    createMajorDto: CreateMajorDto,
    curriculumId: number
    ): Promise<MajorResponseDto> {
    const curriculum = await this.curriculumRepository.findOne({
        where: { id: curriculumId }
    });

    if (!curriculum) {
        throw new BadRequestException(`Curriculum with ID ${curriculumId} does not exist`);
    }
    const major = this.majorRepository.create({
      ...createMajorDto,
      curriculum
    });

    const savedMajor = await this.majorRepository.save(major);
    return this.findOne(savedMajor.id);
  }

  async findAll(curriculumId: number): Promise<MajorResponseDto[]> {
    const majors = await this.majorRepository.find({ 
      where: { curriculum: { id: curriculumId } },
      relations: ['concentrations'] 
    });
    return plainToInstance(MajorResponseDto, majors);
  }

  async findOne(id: number): Promise<MajorResponseDto> {
    const major = await this.majorRepository.findOne({ 
      where: { id },
      relations: ['curriculum']
    });
    if (!major) {
      throw new NotFoundException(`Major with ID ${id} not found`);
    }
    return plainToInstance(MajorResponseDto, {
        ...major,
        curriculum: major.curriculum.id
    });
  }
  async findAllByCurriculumId(curriculumId: number): Promise<Major[]> {
    const majors = await this.majorRepository.find({
      where: { curriculum: { id: curriculumId } },
    });

    // Get concentrations for each major
    const majorsWithConcentrations = await Promise.all(
      majors.map(async (major) => {
        const concentrations = await this.concentrationService.findAllByMajorId(major.id);
        return {
          ...major,
          concentrations,
        };
      })
    );

    return majorsWithConcentrations;
  }
  
  async update(id: number, updateMajorDto: UpdateMajorDto): Promise<MajorResponseDto> {
    const major = await this.majorRepository.findOne({ 
      where: { id },
      relations: ['curriculum']
    });
    if (!major) {
      throw new NotFoundException(`Major with ID ${id} not found`);
    }

    Object.assign(major, updateMajorDto)
    await this.majorRepository.save(major);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const major = await this.majorRepository.findOne({ 
      where: { id },
      relations: ['curriculum', 'concentrations']
    });
    
    if (!major) {
      throw new NotFoundException(`Major with ID ${id} not found`);
    }

    // Remove concentrations and their nested entities first
    await this.concentrationRepository.remove(major.concentrations);
    await this.majorRepository.remove(major);
  }
}