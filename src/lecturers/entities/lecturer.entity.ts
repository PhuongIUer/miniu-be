import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Major } from '../../majors/entities/major.entity';

@Entity()
export class Lecturer {
  @PrimaryGeneratedColumn()
  lecturer_id: number;

  @Column()
  lecturer_name: string;

  @Column()
  lecturer_email: string;

  @Column('simple-array')
  lecturer_position: string[];

  @Column({ nullable: true })
  lecturer_avturl: string;

  @ManyToOne(() => Major, major => major.lecturers)
  major: Major;
}