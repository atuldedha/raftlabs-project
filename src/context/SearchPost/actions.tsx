import { Dispatch } from "react";
import { ActionType, State } from "./reducer";

// update user func.
export const addPostsToBst = (dispatch: Dispatch<any>) => (post: State) => {
  dispatch({
    type: ActionType.ADD_POSTS_BST,
    payload: { ...post },
  });
};

export const updateSearchTerm = (dispatch: Dispatch<any>) => (term: string) => {
  dispatch({
    type: ActionType.UPADET_SEARCH,
    payload: term,
  });
};

export const updateSearchResult =
  (dispatch: Dispatch<any>) => (results: []) => {
    dispatch({
      type: ActionType.SEARCH_RESULT,
      payload: results,
    });
  };
