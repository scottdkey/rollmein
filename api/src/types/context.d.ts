import {DefaultContext, ParameterizedContext} from "koa";
import {DataResponse} from "./DataResponse";

interface MyState {
    user: { id: string } | null
    validUser: boolean
    groupId: string | null
}
interface MyContext<RequestBody, ResponseBody> extends ParameterizedContext<MyState, DefaultContext, DataResponse<ResponseBody>>{
    request: {
        body: RequestBody
    }
}