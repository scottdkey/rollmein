import { User } from "./User";
import { Field, ObjectType } from "type-graphql";
import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";


@ObjectType()
@Entity()
export class Player {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @ManyToOne({ entity: () => User })
  userId!: User['id']

  @Field()
  @Property()
  name!: string;

  @Field()
  @Property()
  tank: boolean = false;

  @Field()
  @Property()
  healer: boolean = false;

  @Field()
  @Property()
  dps: boolean = false;

  @Field()
  @Property()
  locked: boolean = false;

  @Field()
  @Property()
  inTheRoll: boolean = false;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
