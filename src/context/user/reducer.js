import { ADD_USER, UPDATE_FROM_LOCAL_STORAGE, SIGN_OUT } from "./keys";

// initial state
export const initialState = {
  userInfo: {},
};

// reducer func.
const reducer = (state, action) => {
  switch (action.type) {
    case ADD_USER:
      // store user in local storage once user signsups
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ ...state, userInfo: action.payload })
      );
      return { ...state, userInfo: action.payload };

    case UPDATE_FROM_LOCAL_STORAGE:
      // update the user state from local storage if user refreshed or comes back to the app later
      return { ...state, userInfo: action.payload };

    // sign out
    case SIGN_OUT:
      localStorage.setItem("userInfo", JSON.stringify({}));
      return { ...state, userInfo: {} };

    default:
      return state;
  }
};

export default reducer;
