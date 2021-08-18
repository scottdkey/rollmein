import { ObjectType, Field } from "type-graphql";


@ObjectType()
export class BasicError {
  @Field()
  type: string;
  @Field()
  message: string;
}

@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}