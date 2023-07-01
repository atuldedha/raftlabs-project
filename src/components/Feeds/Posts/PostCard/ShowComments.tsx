import { UserCircleIcon } from "@heroicons/react/24/outline";
import React from "react";
import { CommentState } from "../../../../../typings";

type ShowCommentProps = {
  allComments: Array<CommentState>;
};

// Show comments compennt
const ShowComments = ({ allComments }: ShowCommentProps) => {
  return (
    <div className="flex h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-black px-4 flex-col">
      {allComments?.map((comment) => (
        <div
          className="flex items-center space-x-2 mb-2 w-full"
          key={comment.id}
        >
          {/* if commented per has image */}
          {/* commented person image */}
          {comment?.commentedUserImage ? (
            <img
              src={comment?.commentedUserImage}
              alt="profile-pic-comment"
              className="rounded-full h-8 w-8 object-cover"
            />
          ) : (
            // if not show icon
            <UserCircleIcon className="h-8 rounded-full cursor-pointer" />
          )}
          {/* comment */}
          <p className="text-xs sm:text-sm flex-1 w-full truncate">
            <span className="font-bold mr-3">{comment?.commentedUsername}</span>
            {comment?.comment}
          </p>
          <p>{new Date(comment?.timestamp?.toMillis()).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default ShowComments;
