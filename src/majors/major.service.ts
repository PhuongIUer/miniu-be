import { Injectable } from '@nestjs/common';
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
    return this.majorsRepository.save(major);
  }

  findAll(): Promise<Major[]> {
    return this.majorsRepository.find({ relations: ['lecturers', 'curricula'] });
  }

  async findOne(id: number): Promise<Major> {
    const major = await this.majorsRepository.findOne({
      where: { major_id: id },
      relations: ['lecturers', 'curricula']
    });
    if (!major) {
      throw new Error(`Major with id ${id} not found`);
    }
    return major;
  }

  async update(id: number, updateMajorDto: UpdateMajorDto): Promise<Major> {
    await this.majorsRepository.update(id, updateMajorDto);
    const updatedMajor = await this.majorsRepository.findOne({ where: { major_id: id } });
    if (!updatedMajor) {
      throw new Error(`Major with id ${id} not found after update`);
    }
    return updatedMajor;
  }

  async remove(id: number): Promise<void> {
    await this.majorsRepository.delete(id);
  }
}