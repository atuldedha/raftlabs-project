import { OPEN_MODAL, CLOSE_MODAL } from "./keys";

// initial state of modal
export const initialState = {
  modalState: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    // open modal
    case OPEN_MODAL:
      return { ...state, modalState: true };
    // close modal
    case CLOSE_MODAL:
      return { ...state, modalState: false };

    default:
      return state;
  }
};

export default reducer;
