import createDataContext from "../DataContext";
import reducer, { initialState } from "./reducer";
import { updateUser, updateUserInfoFromLocalStorage, signout } from "./actions";

// creating Context for user in the form of redux
export const { Context: UserContext, Provider: UserProvider } =
  createDataContext(
    reducer,
    { updateUser, updateUserInfoFromLocalStorage, signout },
    initialState
  );
