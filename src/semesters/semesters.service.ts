import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Semester } from './entities/semester.entity';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { CurriculaService } from '../curricula/curricula.service';

@Injectable()
export class SemestersService {
  constructor(
    @InjectRepository(Semester)
    private semestersRepository: Repository<Semester>,
    private curriculaService: CurriculaService,
  ) {}

  async create(createSemesterDto: CreateSemesterDto): Promise<Semester> {
    const curriculum = await this.curriculaService.findOne(createSemesterDto.curriculum_id);
    const semester = this.semestersRepository.create({
      ...createSemesterDto,
      curriculum,
    });
    return await this.semestersRepository.save(semester);
  }

  async findAll(): Promise<Semester[]> {
    return await this.semestersRepository.find({
      relations: ['curriculum', 'subjects'],
    });
  }

  async findOne(id: number): Promise<Semester> {
    const semester = await this.semestersRepository.findOne({
      where: { semester_id: id },
      relations: ['curriculum', 'subjects'],
    });

    if (!semester) {
      throw new NotFoundException(`Semester with ID ${id} not found`);
    }

    return semester;
  }

  async update(id: number, updateSemesterDto: UpdateSemesterDto): Promise<Semester> {
    const semester = await this.findOne(id);
    
    if (updateSemesterDto.curriculum_id) {
      const curriculum = await this.curriculaService.findOne(updateSemesterDto.curriculum_id);
      semester.curriculum = curriculum;
    }

    this.semestersRepository.merge(semester, updateSemesterDto);
    return await this.semestersRepository.save(semester);
  }

  async remove(id: number): Promise<void> {
    const result = await this.semestersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Semester with ID ${id} not found`);
    }
  }
}