import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { Subject } from './entities/subject.entity';
import { SemestersModule } from '../semesters/semesters.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subject]),
    SemestersModule, // Import SemestersModule
  ],
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}