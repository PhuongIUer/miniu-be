import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurriculumController } from './curriculum.controller';
import { CurriculumService } from './services/curriculum.service';
import { Curriculum } from './entities/curriculum.entity';
import { Major } from './entities/major.entity';
import { Concentration } from './entities/concentration.entity';
import { Semester } from './entities/semester.entity';
import { Subject } from './entities/subject.entity';
import { MajorService } from './services/major.service';
import { ConcentrationService } from './services/concentration.service';
import { SemesterService } from './services/semester.service';
import { SubjectService } from './services/subject.service';
import { MajorController } from './controllers/major.controller';
import { ConcentrationController } from './controllers/concentration.controller';
import { SemesterController } from './controllers/semester.controller';
import { SubjectController } from './controllers/subject.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Curriculum,
      Major,
      Concentration,
      Semester,
      Subject
    ])
  ],
  controllers: [
    CurriculumController,
    MajorController,
    ConcentrationController,
    SemesterController,
    SubjectController
  ],
  providers: [
    CurriculumService,
    MajorService,
    ConcentrationService,
    SemesterService,
    SubjectService
  ],
  exports: [
    CurriculumService,
    MajorService,
    ConcentrationService,
    SemesterService,
    SubjectService
  ]
})
export class CurriculumModule {}