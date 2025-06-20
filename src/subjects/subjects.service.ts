import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SemestersService } from '../semesters/semesters.service';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private subjectsRepository: Repository<Subject>,
    private semestersService: SemestersService,
  ) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const semester = await this.semestersService.findOne(createSubjectDto.semester_id);
    const subject = this.subjectsRepository.create({
      ...createSubjectDto,
      semester,
    });
    return await this.subjectsRepository.save(subject);
  }

  async findAll(): Promise<Subject[]> {
    return await this.subjectsRepository.find({ relations: ['semester'] });
  }

  async findOne(id: number): Promise<Subject> {
    const subject = await this.subjectsRepository.findOne({
      where: { subject_id: id },
      relations: ['semester'],
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    return subject;
  }

  async update(id: number, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    const subject = await this.findOne(id);
    
    if (updateSubjectDto.semester_id) {
      const semester = await this.semestersService.findOne(updateSubjectDto.semester_id);
      subject.semester = semester;
    }

    this.subjectsRepository.merge(subject, updateSubjectDto);
    return await this.subjectsRepository.save(subject);
  }

  async remove(id: number): Promise<void> {
    const result = await this.subjectsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
  }
}