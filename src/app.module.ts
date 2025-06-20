import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MajorsModule } from './majors/majors.module';
import { LecturersModule } from './lecturers/lecturers.module';
import { CurriculaModule } from './curricula/curricula.module';
import { SemestersModule } from './semesters/semesters.module';
import { SubjectsModule } from './subjects/subjects.module';
import { Major } from './majors/entities/major.entity';
import { Lecturer } from './lecturers/entities/lecturer.entity';
import { Curriculum } from './curricula/entities/curriculum.entity';
import { Semester } from './semesters/entities/semester.entity';
import { Subject } from './subjects/entities/subject.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'miniu_db',
      entities: [Major, Lecturer, Curriculum, Semester, Subject],
      synchronize: true, // Chỉ dùng cho development
    }),
    MajorsModule,
    LecturersModule,
    CurriculaModule,
    SemestersModule,
    SubjectsModule,
  ],
})
export class AppModule {}