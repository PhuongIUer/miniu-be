import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MajorsService } from './majors.service';
import { MajorsController } from './majors.controller';
import { Major } from './entities/major.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Major])],
  controllers: [MajorsController],
  providers: [MajorsService],
  exports: [MajorsService, TypeOrmModule], // Export both service and TypeORM feature
})
export class MajorsModule {}