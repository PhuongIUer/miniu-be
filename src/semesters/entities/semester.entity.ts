import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Curriculum } from '../../curricula/entities/curriculum.entity';
import { Subject } from '../../subjects/entities/subject.entity';

@Entity()
export class Semester {
  @PrimaryGeneratedColumn()
  semester_id: number;

  @Column()
  semester_name: string;

  @ManyToOne(() => Curriculum, curriculum => curriculum.semesters)
  curriculum: Curriculum;

  @OneToMany(() => Subject, subject => subject.semester)
  subjects: Subject[];
}