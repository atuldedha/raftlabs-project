import React from "react";
// import Avatar from "./avatar.svg";

const StoryCard = ({ data }: any) => {
  return (
    <div className="flex flex-col space-y-1 items-center">
      <img
        src=""
        alt="profile"
        className="h-14 w-14 p-[1.5px] rounded-full  object-cover border-red-400 border-2 cursor-pointer hover:scale-105 transition-all transform duration-150 ease-out"
      />
      <span className="font-medium text-xs text-gray-800 w-14 truncate text-center">
        {data.username}
      </span>
    </div>
  );
};

export default StoryCard;
