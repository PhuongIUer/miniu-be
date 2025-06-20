import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Major } from './entities/major.entity';
import { CreateMajorDto } from './dto/create-major.dto';
import { UpdateMajorDto } from './dto/update-major.dto';

@Injectable()
export class MajorsService {
  constructor(
    @InjectRepository(Major)
    private majorsRepository: Repository<Major>,
  ) {}

  async create(createMajorDto: CreateMajorDto): Promise<Major> {
    const major = this.majorsRepository.create(createMajorDto);
    return await this.majorsRepository.save(major);
  }

  async findAll(): Promise<Major[]> {
    return await this.majorsRepository.find({
      relations: ['lecturers', 'curricula'],
    });
  }

  async findOne(id: number): Promise<Major> {
    const major = await this.majorsRepository.findOne({
      where: { major_id: id },
      relations: ['lecturers', 'curricula'],
    });

    if (!major) {
      throw new NotFoundException(`Major with ID ${id} not found`);
    }

    return major;
  }

  async update(id: number, updateMajorDto: UpdateMajorDto): Promise<Major> {
    const major = await this.findOne(id);
    this.majorsRepository.merge(major, updateMajorDto);
    return await this.majorsRepository.save(major);
  }

  async remove(id: number): Promise<void> {
    const result = await this.majorsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Major with ID ${id} not found`);
    }
  }
}