import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../../database/abstract.entity";

@Entity('whitelist_jwt')
export class WhitelistJwt extends AbstractEntity <WhitelistJwt> {
  @PrimaryGeneratedColumn({name: 'id'})
  id: number;

  @Column({type: 'integer', nullable: false, name: 'user_id'})
  userId: number;

  @Column({type: 'varchar', length: 255, nullable: false})
  jti: string;
}
