import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curriculum } from '../entities/curriculum.entity';
import { Major } from '../entities/major.entity';
import { CreateCurriculumDto, UpdateCurriculumDto, CurriculumResponseDto } from '../dtos/curriculum.dto';
import { plainToInstance } from 'class-transformer';
import { MajorService } from './major.service';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class CurriculumService {
  constructor(
    @InjectRepository(Curriculum)
    private readonly curriculumRepository: Repository<Curriculum>,
    @InjectRepository(Major)
    private readonly majorRepository: Repository<Major>,
    private readonly majorService: MajorService,
  ) {}

  async create(createCurriculumDto: CreateCurriculumDto): Promise<CurriculumResponseDto> {
    if (!createCurriculumDto.name) {
      throw new BadRequestException('Curriculum name is required');
    }
  const curriculum = this.curriculumRepository.create({
    name: createCurriculumDto.name,
  });

    const savedCurriculum = await this.curriculumRepository.save(curriculum);
    return this.findOneWithId(savedCurriculum.id);
  }
async findLatestOne(): Promise<CurriculumResponseDto> {
  const [latestCurriculum] = await this.curriculumRepository.find({
    order: {
      id: 'DESC' 
    },
    take: 1
  });

  if (!latestCurriculum) {
    throw new NotFoundException('No curriculum found');
  }
  return this.findOne(latestCurriculum.id);
}

async findOne(id: number) {
  const curriculum = await this.curriculumRepository.findOne({ where: { id } });
  if (!curriculum) throw new NotFoundException(`Curriculum ${id} not found`);

  const majors = await this.majorService.findAllByCurriculumId(id);

  const removeIds = (obj: any) => {
    if (Array.isArray(obj)) {
      return obj.map(item => removeIds(item));
    } else if (obj && typeof obj === 'object') {
      const newObj = { ...obj };
      delete newObj.id;
      Object.keys(newObj).forEach(key => {
        newObj[key] = removeIds(newObj[key]);
      });
      return newObj;
    }
    return obj;
  };

  return removeIds({ ...curriculum, majors });
}
async findOneWithId(id: number) {
  const curriculum = await this.curriculumRepository.findOne({ where: { id } });
  if (!curriculum) throw new NotFoundException(`Curriculum ${id} not found`);

  const majors = await this.majorService.findAllByCurriculumId(id);

  return { ...curriculum, majors };
}

  @Transactional()
  async update(id: number, updateCurriculumDto: UpdateCurriculumDto): Promise<CurriculumResponseDto> {
    const curriculum = await this.curriculumRepository.findOne({ 
      where: { id }
    });
    if (!curriculum) {
      throw new NotFoundException(`Curriculum with ID ${id} not found`);
    }

    Object.assign(curriculum, updateCurriculumDto)
    await this.curriculumRepository.save(curriculum);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const curriculum = await this.curriculumRepository.findOne({ 
      where: { id },
      relations: ['majors']
    });
    if (!curriculum) {
      throw new NotFoundException(`Curriculum with ID ${id} not found`);
    }

    // Remove majors and their nested entities first
    await this.majorRepository.remove(curriculum.majors);
    await this.curriculumRepository.remove(curriculum);
  }

}