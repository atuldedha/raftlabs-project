import { ADD_USER, SIGN_OUT, UPDATE_FROM_LOCAL_STORAGE } from "./keys";

interface UserInfo {
    username: "string";
    userImage: "string";
    status: "image";
    following: "array";
    followers: "array";
    uid: "string";
}
  
  
  interface UserState {
    userInfo: UserInfo;
  }
  
  interface UpdateUserInfoFromLocalStorageAction {
    type: typeof UPDATE_FROM_LOCAL_STORAGE;
    payload: UserInfo;
  }
  
  interface AddUserAction {
    type: typeof ADD_USER;
    payload: UserInfo;
  }
  
  interface SignOutAction {
    type: typeof SIGN_OUT;
  }
  
  type UserAction =
    | UpdateUserInfoFromLocalStorageAction
    | AddUserAction
    | SignOutAction;
  
  export type { UserState, UserAction };