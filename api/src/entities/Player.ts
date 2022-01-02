
import { Field, ObjectType } from "type-graphql";
import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./User";


@ObjectType()
@Entity()
export class Player {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => User)
  @ManyToOne(() => User)
  user: User

  @Field()
  @Property()
  name!: string;

  @Field()
  @Property()
  tank!: boolean

  @Field()
  @Property()
  healer!: boolean

  @Field()
  @Property()
  dps!: boolean

  @Field()
  @Property()
  locked!: boolean

  @Field()
  @Property()
  inTheRoll: boolean

  @Field(() => Date)
  @Property({
    type: 'string'
  })
  createdAt = new Date();

  @Field(() => Date)
  @Property({
    type: "string",
    onUpdate: () => new Date()
  })
  updatedAt = new Date();
}
