import createDataContext from "../DataContext";
import reducer, { State, initialState } from "./reducer";
import { updateUser, updateUserInfoFromLocalStorage, signout } from "./actions";

export type UserContextType = {
  state: State;
  updateUser: (user: State) => void;
  updateUserInfoFromLocalStorage: (user: State) => void;
  signout: () => void;
  // Add other actions as needed
};

// creating Context for user in the form of redux
export const { Context: UserContext, Provider: UserProvider } =
  createDataContext(
    reducer,
    { updateUser, updateUserInfoFromLocalStorage, signout },
    initialState
  );
