import { OPEN_MODAL, CLOSE_MODAL } from "./keys";

// open modal func.
export const openModal = (dispatch) => () => {
  dispatch({
    type: OPEN_MODAL,
    payload: true,
  });
};

// close modal func.
export const closeModal = (dispatch) => () => {
  dispatch({
    type: CLOSE_MODAL,
    payload: false,
  });
};
