import { Dispatch } from "react";
import { ActionType, UserInfo } from "./reducer";

// update user func.
export const updateUser = (dispatch: Dispatch<any>) => (user: UserInfo) => {
  dispatch({
    type: ActionType.ADD_USER,
    payload: { ...user },
  });
};
// update user from local storage func.
export const updateUserInfoFromLocalStorage =
  (dispatch: Dispatch<any>) => (user: UserInfo) => {
    dispatch({
      type: ActionType.UPDATE_FROM_LOCAL_STORAGE,
      payload: { ...user },
    });
  };
// signout func.
export const signout = (dispatch: Dispatch<any>) => () => {
  dispatch({
    type: ActionType.SIGN_OUT,
    payload: {},
  });
};
