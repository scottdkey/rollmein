import {DefaultContext, ParameterizedContext} from "koa";
import {DataResponse} from "./DataResponse";
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

interface MyState {
    user: DecodedIdToken
    token: string | undefined
    validUser: boolean
    groupId: string | null
}
interface MyContext<RequestBody, ResponseBody> extends ParameterizedContext<MyState, DefaultContext, DataResponse<ResponseBody>>{
    request: {
        body: RequestBody
    }
}