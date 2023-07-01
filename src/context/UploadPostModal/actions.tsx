import { Dispatch } from "react";
import { OPEN_MODAL, CLOSE_MODAL } from "./keys";

// open modal func.
export const openModal = (dispatch: Dispatch<any>) => () => {
  dispatch({
    type: OPEN_MODAL,
    payload: true,
  });
};

// close modal func.
export const closeModal = (dispatch: Dispatch<any>) => () => {
  dispatch({
    type: CLOSE_MODAL,
    payload: false,
  });
};
