import { User } from "./User";
import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@ObjectType()
@Entity()
export class Player extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.players)
  userId!: string

  @Field()
  @Column({ type: 'text' })
  playerName!: string;

  @Field()
  @Column({ type: 'boolean' })
  tank: boolean = false;

  @Field()
  @Column({ type: 'boolean' })
  healer: boolean = false;

  @Field()
  @Column({ type: 'boolean' })
  dps: boolean = false;

  @Field()
  @Column({ type: 'boolean' })
  locked: boolean = false;

  @Field()
  @Column({ type: 'boolean' })
  inTheRoll: boolean = false;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date
}
