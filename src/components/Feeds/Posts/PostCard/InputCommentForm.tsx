import { FaceSmileIcon } from "@heroicons/react/24/outline";
import React, { useRef, useState } from "react";
import TagInput from "../../../TagInput/TagInput";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../firebase";
import { CommonState, PostsState } from "../../../../../typings";

type InputCommentFormProps = {
  userInfo: CommonState;
  data: PostsState;
};
const InputCommentForm = ({ userInfo, data }: InputCommentFormProps) => {
  // comment ref
  const commentRef = useRef<any>();
  // state for comment input
  const [comment, setComment] = useState("");

  // suggestion for tagging state
  const [suggestions, setSuggestions] = useState<Array<Partial<CommonState>>>(
    []
  );
  // show suggestions for tagging state
  const [showSuggestions, setShowSuggestions] = useState(false);

  // handler func. for commnet input change
  const handleCommentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setComment(value);
    // if not following anyone do not show suggestions
    if (!userInfo?.following || userInfo?.following?.length === 0) {
      return setShowSuggestions(false);
    }

    // if we type @ then show the suggestions box
    if (value.includes("@")) {
      // matching search text to usernames
      const searchText = value.split("@")[1];
      // saving all the suggestions
      const filteredSuggestions: Array<Partial<CommonState>> =
        userInfo?.following.filter((person: any) =>
          person.username.toLowerCase().includes(searchText.toLowerCase())
        );
      // setting suggetion state
      setSuggestions(filteredSuggestions);
      // setting show suggestions true
      setShowSuggestions(true);
    } else {
      // else set suggestions to false
      setShowSuggestions(false);
    }
  };

  // click handler func. for suggestions
  const handleSuggestionClick = (suggestion: string) => {
    // set input comment value to updated value
    setComment(comment + `${suggestion} `);
    // when cliked on a suggestion after updating the input close the suggestion box
    setShowSuggestions(false);
    // focus should remain on input even after click on a suggestion
    commentRef?.current?.focus();
  };

  // save comment to database
  const handlePostComment = async (e: React.MouseEvent) => {
    e.preventDefault();
    // clicked on comment empty the input and handle things behind the screen
    const tempComment = comment;
    setComment("");

    // firebase func.
    // adding commentPostsState
    await addDoc(
      collection(db, "Users", data?.uid, "Posts", data?.id, "Comments"),
      {
        comment: tempComment,
        timestamp: serverTimestamp(),
        commentedUsername: userInfo?.username,
        commentedUserImage: userInfo?.userImage || "",
      }
    );
  };

  return (
    <form className="flex items-center p-4 space-x-4">
      <FaceSmileIcon className="h-7" />
      <div className="relative flex-1">
        <input
          className="border-none flex flex-1 w-full focus:ring-0 outline-none"
          type="text"
          value={comment}
          ref={commentRef}
          onChange={handleCommentInputChange}
          placeholder="Add a comment..."
        />
        {showSuggestions && (
          <TagInput
            suggestions={suggestions}
            handleSuggestionClick={handleSuggestionClick}
          />
        )}
      </div>
      <button
        className="font-semibold text-blue-400"
        disabled={!comment.trim()}
        onClick={handlePostComment}
      >
        Post
      </button>
    </form>
  );
};

export default InputCommentForm;
