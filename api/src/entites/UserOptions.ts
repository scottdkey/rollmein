import { User } from "./User";
import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class UserOptions extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'text' })
  rollType: string;

  @Field()
  @Column({ type: 'boolean' })
  lockAfterOut: boolean;

  @Field()
  @Column({ type: 'text' })
  theme: string;

  @OneToOne(() => User, user => user.options)
  userId!: User['id']
}

