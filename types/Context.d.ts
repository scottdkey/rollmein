import { DefaultContext, ParameterizedContext } from "koa";
import { DataResponse } from "./DataResponse";
import { CacheUser, User } from "./user";


interface MyState {
    user: CacheUser | null = null
    token: string | null = null
    validUser: boolean = false
    groupId: string | null
}

interface MyContext<RequestBody, ResponseBody> extends ParameterizedContext<MyState, DefaultContext, ResponseBody> {
    request: {
        body: RequestBody
    }
}