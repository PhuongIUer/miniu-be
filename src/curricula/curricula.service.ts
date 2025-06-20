import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curriculum } from './entities/curriculum.entity';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
import { MajorsService } from '../majors/majors.service';

@Injectable()
export class CurriculaService {
  constructor(
    @InjectRepository(Curriculum)
    private curriculaRepository: Repository<Curriculum>,
    private majorsService: MajorsService,
  ) {}

  async create(createCurriculumDto: CreateCurriculumDto): Promise<Curriculum> {
    const major = await this.majorsService.findOne(createCurriculumDto.major_id);
    const curriculum = this.curriculaRepository.create({
      ...createCurriculumDto,
      major,
    });
    return await this.curriculaRepository.save(curriculum);
  }

  async findAll(): Promise<Curriculum[]> {
    return await this.curriculaRepository.find({
      relations: ['major', 'semesters'],
    });
  }

  async findOne(id: number): Promise<Curriculum> {
    const curriculum = await this.curriculaRepository.findOne({
      where: { curriculum_id: id },
      relations: ['major', 'semesters'],
    });

    if (!curriculum) {
      throw new NotFoundException(`Curriculum with ID ${id} not found`);
    }

    return curriculum;
  }

  async update(id: number, updateCurriculumDto: UpdateCurriculumDto): Promise<Curriculum> {
    const curriculum = await this.findOne(id);
    
    if (updateCurriculumDto.major_id) {
      const major = await this.majorsService.findOne(updateCurriculumDto.major_id);
      curriculum.major = major;
    }

    this.curriculaRepository.merge(curriculum, updateCurriculumDto);
    return await this.curriculaRepository.save(curriculum);
  }

  async remove(id: number): Promise<void> {
    const result = await this.curriculaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Curriculum with ID ${id} not found`);
    }
  }
}