import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../database/abstract.entity";
import { User } from "../../users/entities/user.entity";

@Entity({name: "role"})
export class Role extends AbstractEntity<Role>{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(()=>User, user=>user.role)
  user: User[]
}