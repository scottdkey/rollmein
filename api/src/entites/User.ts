
import { Field, ID, ObjectType } from "type-graphql";
import { Collection, Entity, OneToMany, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { v4 } from "uuid";
import { Player } from "./Player";

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryKey()
  id: string = v4();

  @Field(() => [Player])
  @OneToMany(() => Player, player => player.user)
  players = new Collection<Player>(this)

  @Field()
  @Property()
  @Unique()
  username!: string;

  @Field()
  @Property()
  @Unique()
  email!: string;

  @Property()
  password!: string;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

}