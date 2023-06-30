import createDataContext from "../DataContext";
import reducer, { initialState } from "./reducer";
import { openModal, closeModal } from "./actions";

// creating context in the form of Redux
export const { Context: ModalContext, Provider: ModalProvider } =
  createDataContext(reducer, { openModal, closeModal }, initialState);
