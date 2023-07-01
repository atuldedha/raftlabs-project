export interface ModalState {
  modalState: Boolean;
}

// initial state of modal
export const initialState: ModalState = {
  modalState: false,
};

export enum ActionType {
  OPEN_MODAL = "OPEN_MODAL",
  CLOSE_MODAL = "CLOSE_MODAL",
}

export type Action =
  | { type: ActionType.OPEN_MODAL; payload: ModalState }
  | { type: ActionType.CLOSE_MODAL; payload: ModalState };

const reducer = (state: ModalState, action: Action): ModalState => {
  switch (action.type) {
    // open modal
    case ActionType.OPEN_MODAL:
      return { ...state, modalState: true };
    // close modal
    case ActionType.CLOSE_MODAL:
      return { ...state, modalState: false };

    default:
      return state;
  }
};

export default reducer;
