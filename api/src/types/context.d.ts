import {DefaultContext, ParameterizedContext} from "koa";
import {DataResponse} from "./DataResponse";

interface MyState {
    user: { id: string } | null
    validUser: boolean
    groupId: string | null
}
type MyContext<T> = ParameterizedContext<MyState, DefaultContext, DataResponse<T>>