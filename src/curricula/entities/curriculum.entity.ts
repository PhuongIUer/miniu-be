import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Major } from '../../majors/entities/major.entity';
import { Semester } from '../../semesters/entities/semester.entity';

@Entity()
export class Curriculum {
  @PrimaryGeneratedColumn()
  curriculum_id: number;

  @Column()
  curriculum_name: string;

  @ManyToOne(() => Major, major => major.curricula)
  major: Major;

  @OneToMany(() => Semester, semester => semester.curriculum)
  semesters: Semester[];
}