import createDataContext from "../DataContext";
import reducer, { initialState } from "./reducer";
import { addPostsToBst, updateSearchResult, updateSearchTerm } from "./actions";

// creating context in the form of Redux
export const { Context: BSTContext, Provider: BSTProvider } = createDataContext(
  reducer,
  { addPostsToBst, updateSearchResult, updateSearchTerm },
  initialState
);
