import { UserCircleIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { CommonState } from "../../../../../typings";

type SuggestionCardProps = {
  item: CommonState;
  following: Array<CommonState>;
  handleFollowButtonClick: (
    uid: string,
    item: CommonState,
    isFollowing: boolean
  ) => void;
  userInfo: CommonState;
};

const SuggestionCard = ({
  item,
  following,
  handleFollowButtonClick,
  userInfo,
}: SuggestionCardProps) => {
  // already following state
  const [isFollowing, setIsFollowing] = useState(false);

  // to check whether we already follow user or not
  useEffect(() => {
    setIsFollowing(
      following?.findIndex(
        (person: any) => person.uid.trim(" ") === item?.uid.trim()
      ) !== -1
    );
  }, [following]);

  return (
    <div className="flex items-center justify-between mt-3" key={item.uid}>
      {/* if user has a valid image */}
      {item?.userImage ? (
        <img
          src={item?.userImage}
          alt=""
          className="h-10 w-10 rounded-full border p-[2px]"
        />
      ) : (
        // else show icon
        <UserCircleIcon className="h-10" />
      )}
      {/* username and name */}
      <div className="flex flex-col flex-1 ml-1">
        <span className="font-semibold text-sm">{item?.username}</span>
        <h3 className="text-xs text-gray-400">{item?.name}</h3>
      </div>

      {/* follow button */}
      <button
        className="text-blue-400 font-normal outline-none"
        onClick={() =>
          handleFollowButtonClick(userInfo?.uid, item, isFollowing)
        }
      >
        {/* if already following: show "following" else show: "follow" */}
        {isFollowing ? "following" : "follow"}
      </button>
    </div>
  );
};

export default SuggestionCard;
