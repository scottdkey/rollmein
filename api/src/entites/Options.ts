import { Field, ID, ObjectType } from "type-graphql";
import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@ObjectType()
@Entity()
export class Options {
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

  @Field(() => Date)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => Date)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  constructor(userId: string) {
    this.userId = userId
  }
}

