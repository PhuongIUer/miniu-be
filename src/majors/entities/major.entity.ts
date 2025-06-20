import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Lecturer } from '../../lecturers/entities/lecturer.entity';
import { Curriculum } from '../../curricula/entities/curriculum.entity';

@Entity()
export class Major {
  @PrimaryGeneratedColumn()
  major_id: number;

  @Column()
  major_name: string;

  @OneToMany(() => Lecturer, lecturer => lecturer.major)
  lecturers: Lecturer[];

  @OneToMany(() => Curriculum, curriculum => curriculum.major)
  curricula: Curriculum[];
}