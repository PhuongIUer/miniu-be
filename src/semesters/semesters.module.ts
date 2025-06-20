import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemestersService } from './semesters.service';
import { SemestersController } from './semesters.controller';
import { Semester } from './entities/semester.entity';
import { CurriculaModule } from '../curricula/curricula.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Semester]),
    CurriculaModule, // Import CurriculaModule
  ],
  controllers: [SemestersController],
  providers: [SemestersService],
  exports: [SemestersService, TypeOrmModule], // Export service and TypeORM
})
export class SemestersModule {}