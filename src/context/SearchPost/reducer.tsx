import { Timestamp } from "firebase/firestore";

interface BSTState {
  caption: string;
  postImage: string;
  timestamp: Timestamp;
  uid: string;
  username: string;
  userImage: string;
  id: string;
  [key: string]: any;
}

export interface State {
  bst: BSTState | {};
  searchTerm: string | "";
  searchResults: Array<BSTState> | [];
}

// initial state
export const initialState: State = {
  bst: {},
  searchTerm: "",
  searchResults: [],
};

export enum ActionType {
  ADD_POSTS_BST = "ADD_POSTS_BST",
  UPADET_SEARCH = "UPADET_SEARCH",
  SEARCH_RESULT = "SEARCH_RESULT",
}

export type Action =
  | { type: ActionType.ADD_POSTS_BST; payload: State }
  | { type: ActionType.UPADET_SEARCH; payload: string }
  | { type: ActionType.SEARCH_RESULT; payload: Array<BSTState> | [] };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.ADD_POSTS_BST:
      return { ...state, bst: action.payload };

    case ActionType.UPADET_SEARCH:
      return { ...state, searchTerm: action.payload };

    case ActionType.SEARCH_RESULT:
      return { ...state, searchResults: action.payload };

    default:
      return state;
  }
};

export default reducer;
