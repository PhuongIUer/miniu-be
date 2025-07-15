import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Subject } from './subject.entity';
import { Concentration } from './concentration.entity';

@Entity('semester')
export class Semester {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Subject, (subject) => subject.semester, { cascade: true })
  subjects: Subject[];

  @ManyToOne(() => Concentration, (concentration) => concentration.semesters)
  concentration: Concentration;
}