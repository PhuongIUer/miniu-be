import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Major } from './major.entity';
import { AbstractEntity } from '../../database/abstract.entity';

@Entity()
export class Curriculum extends AbstractEntity<Curriculum> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Major, major => major, { cascade: true })
  majors: Major[];

}