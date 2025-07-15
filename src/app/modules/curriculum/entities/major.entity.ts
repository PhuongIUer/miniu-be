import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Concentration } from './concentration.entity';
import { Curriculum } from '../entities/curriculum.entity';
@Entity()
export class Major {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Curriculum, curriculum => curriculum.majors, { eager: false })
  curriculum: Curriculum;
  
    @OneToMany(() => Concentration, (concentration) => concentration.major, { cascade: true })
    concentrations: Concentration[];
}