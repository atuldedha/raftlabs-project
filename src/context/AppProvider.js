import React from "react";
import providers from "./providers";

// Binding All of the providers from each context
export default ({ children }) => {
  let result = children;
  providers.forEach((Wrapper) => {
    result = <Wrapper>{result}</Wrapper>;
  });
  return result;
};
