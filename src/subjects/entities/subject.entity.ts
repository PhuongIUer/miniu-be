import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Semester } from '../../semesters/entities/semester.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  subject_id: number;

  @Column()
  subject_name: string;

  @Column()
  subject_credit: number;

  @ManyToOne(() => Semester, semester => semester.subjects)
  semester: Semester;
}