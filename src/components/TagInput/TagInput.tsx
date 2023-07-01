import React from "react";
import { CommonState } from "../../../typings";

type TagInpuProps = {
  suggestions: Array<Partial<CommonState>>;
  handleSuggestionClick: (username: string) => void;
};

const TagInput = ({ suggestions, handleSuggestionClick }: TagInpuProps) => {
  return (
    <div className="flex flex-col space-y-2 absolute top-10 left-0 right-0 bg-gray-200 shadow-md rounded-md z-10 h-20 overflow-y-auto">
      {suggestions?.map((item) => (
        <span
          key={item.uid}
          className="cursor-pointer py-2 px-4 hover:bg-gray-700 hover:text-white transition-all duration-150 ease-in-out"
          onClick={() => item?.username && handleSuggestionClick(item.username)}
        >
          {item.username}
        </span>
      ))}
    </div>
  );
};

export default TagInput;
