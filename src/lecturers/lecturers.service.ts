import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lecturer } from './entities/lecturer.entity';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';
import { MajorsService } from '../majors/majors.service';

@Injectable()
export class LecturersService {
  constructor(
    @InjectRepository(Lecturer)
    private lecturersRepository: Repository<Lecturer>,
    private majorsService: MajorsService,
  ) {}

  async create(createLecturerDto: CreateLecturerDto): Promise<Lecturer> {
    const major = await this.majorsService.findOne(createLecturerDto.major_id);
    const lecturer = this.lecturersRepository.create({
      ...createLecturerDto,
      major,
    });
    return await this.lecturersRepository.save(lecturer);
  }

  async findAll(): Promise<Lecturer[]> {
    return await this.lecturersRepository.find({ relations: ['major'] });
  }

  async findOne(id: number): Promise<Lecturer> {
    const lecturer = await this.lecturersRepository.findOne({
      where: { lecturer_id: id },
      relations: ['major'],
    });

    if (!lecturer) {
      throw new NotFoundException(`Lecturer with ID ${id} not found`);
    }

    return lecturer;
  }

  async update(id: number, updateLecturerDto: UpdateLecturerDto): Promise<Lecturer> {
    const lecturer = await this.findOne(id);
    
    if (updateLecturerDto.major_id) {
      const major = await this.majorsService.findOne(updateLecturerDto.major_id);
      lecturer.major = major;
    }

    this.lecturersRepository.merge(lecturer, updateLecturerDto);
    return await this.lecturersRepository.save(lecturer);
  }

  async remove(id: number): Promise<void> {
    const result = await this.lecturersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Lecturer with ID ${id} not found`);
    }
  }
}