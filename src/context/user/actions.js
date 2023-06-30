import { ADD_USER, UPDATE_FROM_LOCAL_STORAGE, SIGN_OUT } from "./keys";

// update user func.
export const updateUser = (dispatch) => (user) => {
  dispatch({
    type: ADD_USER,
    payload: { ...user },
  });
};
// update user from local storage func.
export const updateUserInfoFromLocalStorage = (dispatch) => (user) => {
  dispatch({
    type: UPDATE_FROM_LOCAL_STORAGE,
    payload: { ...user },
  });
};
// signout func.
export const signout = (dispatch) => () => {
  dispatch({
    type: SIGN_OUT,
    payload: {},
  });
};
