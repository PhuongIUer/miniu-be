import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Semester } from './semester.entity';
import { Major } from './major.entity';

@Entity('concentration')
export class Concentration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Semester, (semester) => semester.concentration, { cascade: true })
  semesters: Semester[];

  @ManyToOne(() => Major, (major) => major.concentrations)
  major: Major;
}