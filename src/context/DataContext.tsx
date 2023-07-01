/* eslint-disable import/no-anonymous-default-export */
import React, { createContext, useReducer, useMemo, Dispatch } from "react";

type Reducer<State, Action> = (state: State, action: Action) => State;
interface Actions {
  [key: string]: (dispatch: Dispatch<any>) => any;
}

interface ProviderProps {
  children: React.ReactNode;
}

// Binding all Context
export default function createDataContext<State, Action>(
  reducer: Reducer<State, Action>,
  actions: Actions,
  initialState: State
) {
  const Context = createContext<any>({});

  const Provider: React.FC<ProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const boundedActions: any = {};
    for (const key in actions) {
      boundedActions[key] = actions[key](dispatch);
    }

    const value = useMemo(
      () => ({ state, ...boundedActions }),
      [boundedActions, state]
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  return { Context, Provider };
}
