import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../database/abstract.entity";
import { Role } from "../../roles/entities/roles.entity";


@Entity({name: 'user'})
export class User extends AbstractEntity<User>{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({nullable: true, name: "username"})
  userName: string;

  @Column({nullable: true})
  avatar: string;

  @Column({nullable: true})
  major: string;

  @Column({nullable: true})
  position: string;

  @Column({nullable: true})
  office: string;

  @ManyToOne(()=>Role, role=>role.user)
  @JoinColumn({name: "role_id"})
  role: Role;
}