/* eslint-disable import/no-anonymous-default-export */
import React, { createContext, useReducer, useMemo } from "react";

// Binding all Context
export default (reducer, actions, initialState) => {
  const Context = createContext({});

  const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const boundedActions = {};
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
};
