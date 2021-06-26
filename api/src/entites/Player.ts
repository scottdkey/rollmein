import { User } from "./User";
import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@ObjectType()
@Entity()
export class Player extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;
  
  @ManyToOne(() => User, user => user.players)
  userId: User['id']
  @Field()
  @Column({ type: 'text' })
  playerName!: string;

  @Field()
  @Column({ type: 'boolean' })
  tank: boolean;

  @Field()
  @Column({ type: 'boolean' })
  healer: boolean;

  @Field()
  @Column({ type: 'boolean' })
  dps: boolean;

  @Field()
  @Column({ type: 'boolean' })
  locked: boolean;

  @Field()
  @Column({ type: 'boolean' })
  inTheRoll: boolean;


  
}
