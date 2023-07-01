export interface UserInfo {
  username: string;
  userImage: string;
  following: Array<object>;
  followers: Array<object>;
  uid: string;
  status: string;
  [key: string]: any;
}
export interface State {
  userInfo: UserInfo | {};
}

// initial state
export const initialState: State = {
  userInfo: {},
};

export enum ActionType {
  ADD_USER = "ADD_USER",
  UPDATE_FROM_LOCAL_STORAGE = "UPDATE_FROM_LOCAL_STORAGE",
  SIGN_OUT = "SIGN_OUT",
}

export type Action =
  | { type: ActionType.ADD_USER; payload: UserInfo }
  | { type: ActionType.UPDATE_FROM_LOCAL_STORAGE; payload: UserInfo }
  | { type: ActionType.SIGN_OUT; payload: {} };

// reducer func.
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.ADD_USER:
      // store user in local storage once user signsups
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ ...state, userInfo: action.payload })
      );
      return { ...state, userInfo: action.payload };

    case ActionType.UPDATE_FROM_LOCAL_STORAGE:
      // update the user state from local storage if user refreshed or comes back to the app later
      return { ...state, userInfo: action.payload };

    // sign out
    case ActionType.SIGN_OUT:
      localStorage.setItem("userInfo", JSON.stringify({}));
      return { ...state, userInfo: {} };

    default:
      return state;
  }
};

export default reducer;
