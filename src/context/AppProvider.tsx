import React, { ReactNode } from "react";
import providers from "./providers";

interface AppProviderProps {
  children: ReactNode;
}

// Binding All of the providers from each context
export default ({ children }: AppProviderProps) => {
  let result = children;
  providers.forEach((Wrapper) => {
    result = <Wrapper>{result}</Wrapper>;
  });
  return result;
};
