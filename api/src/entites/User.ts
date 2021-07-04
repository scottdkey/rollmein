

import { Field, ObjectType } from "type-graphql";
import { Collection, Entity, OneToMany, OneToOne, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { Player } from "./Player"
import { UserOptions } from "./UserOptions";


@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  id: string;

  @OneToMany(() => Player, player => player.userId)
  players = new Collection<Player>(this)

  @OneToOne(() => UserOptions, userOptions => userOptions.userId)
  optionsId: UserOptions['userId']

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