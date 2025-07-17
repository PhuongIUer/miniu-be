import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Semester } from '../entities/semester.entity';
import { Subject } from '../entities/subject.entity';
import { CreateSemesterDto, UpdateSemesterDto, SemesterResponseDto } from '../dtos/semester.dto';
import { plainToInstance } from 'class-transformer';
import { SubjectService } from './subject.service';
import { Concentration } from '../entities/concentration.entity';

@Injectable()
export class SemesterService {
  constructor(
    @InjectRepository(Concentration)
    private readonly concentrationRepository: Repository<Concentration>,
    @InjectRepository(Semester)
    private readonly semesterRepository: Repository<Semester>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    private readonly subjectService: SubjectService,
  ) {}

  async create(
    createSemesterDto: CreateSemesterDto,
    concentrationiD: number
  ): Promise<SemesterResponseDto> {
    console.log('Creating semester with DTO:', createSemesterDto, 'for concentration ID:', concentrationiD);
    const concentration = await this.concentrationRepository.findOne({
        where: { id: concentrationiD }
    });

    if (!concentration) {
        throw new BadRequestException(`Concentration with ID ${concentrationiD} does not exist`);
    }
    const semester = this.semesterRepository.create({
      ...createSemesterDto,
      concentration
    });

    const savedSemester = await this.semesterRepository.save(semester);
    return this.findOne(savedSemester.id);
  }
  async findAllByConcentrationId(concentrationId: number): Promise<Semester[]> {
    const semesters = await this.semesterRepository.find({
      where: { concentration: { id: concentrationId } },
    });

    // Get subjects for each semester
    const semestersWithSubjects = await Promise.all(
      semesters.map(async (semester) => {
        const subjects = await this.subjectService.findAllBySemesterId(semester.id);
        return {
          ...semester,
          subjects,
        };
      })
    );

    return semestersWithSubjects;
  }
  async findAll(concentrationId: number): Promise<SemesterResponseDto[]> {
    const semesters = await this.semesterRepository.find({ 
        where: { concentration: { id: concentrationId} },
        order: { id: 'ASC' },
        relations: ['subjects'] });

    return plainToInstance(SemesterResponseDto, semesters);
  }

  async findOne(id: number): Promise<SemesterResponseDto> {
    const semester = await this.semesterRepository.findOne({ 
      where: { id }
    });
    if (!semester) {
      throw new NotFoundException(`Semester with ID ${id} not found`);
    }
    return plainToInstance(SemesterResponseDto, {
        ...semester
    });
  }

  async update(id: number, updateSemesterDto: UpdateSemesterDto): Promise<SemesterResponseDto> {
    const semester = await this.semesterRepository.findOne({ 
      where: { id },
      relations: ['subjects']
    });
    if (!semester) {
      throw new NotFoundException(`Semester with ID ${id} not found`);
    }

    Object.assign(semester, updateSemesterDto)
    await this.semesterRepository.save(semester);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const semester = await this.semesterRepository.findOne({ 
      where: { id },
      relations: ['concentration', 'subjects']
    });
    if (!semester) {
      throw new NotFoundException(`Semester with ID ${id} not found`);
    }

    // Remove subjects first
    await this.subjectRepository.remove(semester.subjects);
    await this.semesterRepository.remove(semester);
  }
}