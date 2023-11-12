import { DefaultContext, ParameterizedContext, Request } from "koa";
import { CacheUser } from "./user";

interface MyState {
  user: CacheUser | null;
  token: string | null;
  validUser: boolean;
  groupId: string | null;
}

interface MyRequest<RequestBody> extends Request {
  body: RequestBody;
}

interface MyContext<RequestBody, ResponseBody>
  extends ParameterizedContext<MyState, DefaultContext, ResponseBody> {
  state: MyState;
  request: {
    body: MyRequest<RequestBody>;
  };
}
