import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Semester } from './semester.entity';

@Entity('subject')
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  credits: number;

  @ManyToOne(() => Semester, (semester) => semester.subjects)
  semester: Semester;
}