import { DefaultContext, ParameterizedContext } from "koa";
import { DataResponse } from "./DataResponse";
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { CacheUser, User } from "./user";


interface IFirebaseInfo {
    firebaseId: string;
    email: string | null;
    googleId: string | null;
    appleId: string | null
}

interface MyState {
    user: CacheUser | null = null
    token: string | null = null
    firebaseInfo: IFirebaseInfo | null = null
    validUser: boolean = false
    groupId: string | null
}

interface MyContext<RequestBody, ResponseBody> extends ParameterizedContext<MyState, DefaultContext, ResponseBody> {
    request: {
        body: RequestBody
    }
}