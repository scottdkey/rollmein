import { User } from "./User";
import { Field, ObjectType } from "type-graphql";
import { Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";

@ObjectType()
@Entity()
export class UserOptions {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field()
  @Property()
  rollType: string;

  @Field()
  @Property()
  lockAfterOut: boolean;

  @Field()
  @Property()
  theme: string;

  @Field()
  @OneToOne(() => User, user => user.optionsId)
  userId!: string
}

