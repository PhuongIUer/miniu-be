import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurriculaService } from './curricula.service';
import { CurriculaController } from './curricula.controller';
import { Curriculum } from './entities/curriculum.entity';
import { MajorsModule } from '../majors/majors.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Curriculum]),
    MajorsModule, // Import MajorsModule
  ],
  controllers: [CurriculaController],
  providers: [CurriculaService],
  exports: [CurriculaService, TypeOrmModule], // Export service and TypeORM
})
export class CurriculaModule {}