import { ObjectType, Field } from "type-graphql";


@ObjectType()
export class BasicError {
  @Field()
  type: string;
  @Field()
  message: string;
}