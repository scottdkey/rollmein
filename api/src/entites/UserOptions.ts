import { Field, ID, ObjectType } from "type-graphql";
import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@ObjectType()
@Entity()
export class UserOptions {
  @Field(() => ID)
  @PrimaryKey()
  userId: string;

  @Field()
  @Property()
  rollType: string = "ffa";

  @Field()
  @Property()
  lockAfterOut: boolean = false;

  @Field()
  @Property()
  theme: string = "dark";
}

