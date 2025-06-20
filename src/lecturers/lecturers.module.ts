import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LecturersService } from './lecturers.service';
import { LecturersController } from './lecturers.controller';
import { Lecturer } from './entities/lecturer.entity';
import { MajorsModule } from '../majors/majors.module'; // Add this import

@Module({
  imports: [
    TypeOrmModule.forFeature([Lecturer]), // For Lecturer repository
    MajorsModule, // Import MajorsModule to use MajorsService
  ],
  controllers: [LecturersController],
  providers: [LecturersService],
})
export class LecturersModule {}