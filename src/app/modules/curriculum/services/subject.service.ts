import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from '../entities/subject.entity';
import { CreateSubjectDto, UpdateSubjectDto, SubjectResponseDto } from '../dtos/subject.dto';
import { plainToInstance } from 'class-transformer';
import { Semester } from '../entities/semester.entity';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Semester)
    private readonly semesterRepository: Repository<Semester>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async create(
    createSubjectDto: CreateSubjectDto,
    semesterId: number
  ): Promise<SubjectResponseDto> {
    const semester = await this.semesterRepository.findOne({ where: { id: semesterId } });
    if (!semester) {
      throw new NotFoundException(`Semester with ID ${semesterId} not found`);
    }
    const subject = this.subjectRepository.create({...createSubjectDto, semester});
    const savedSubject = await this.subjectRepository.save(subject);
    return this.findOne(savedSubject.id);
  }

  async findAll(semesterId: number): Promise<SubjectResponseDto[]> {
    const subjects = await this.subjectRepository.find({
        where: { semester: { id: semesterId } },
        order: { name: 'ASC' },
    });
    return plainToInstance(SubjectResponseDto, subjects);
  }

  async findOne(id: number): Promise<SubjectResponseDto> {
    const subject = await this.subjectRepository.findOne({ 
        where: { id }
    });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return plainToInstance(SubjectResponseDto, {
        ...subject
    });

  }
async findAllBySemesterId(semesterId: number): Promise<Subject[]> {
    return this.subjectRepository.find({
      where: { semester: { id: semesterId } },
    });
  }
  async update(id: number, updateSubjectDto: UpdateSubjectDto): Promise<SubjectResponseDto> {
    const subject = await this.subjectRepository.findOne({
        where: { id }, 
        relations: ['semester']
    });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    Object.assign(subject, updateSubjectDto);
    await this.subjectRepository.save(subject);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const subject = await this.subjectRepository.findOne({
        where: { id }, 
        relations: ['semester']
    });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    await this.subjectRepository.remove(subject);
  }
}