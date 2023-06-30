import React, { useEffect, useState } from "react";
import {
  BookmarkIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as FilledHeart } from "@heroicons/react/24/solid";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import ShowComments from "./ShowComments";
import InputCommentForm from "./InputCommentForm";

// Post Card Component
const PostCard = ({ userInfo, data }) => {
  // post loading state
  const [postLoading, setPostLoading] = useState(true);
  // post load error state
  const [postLoadError, setPostLoadError] = useState(false);

  // all comments state
  const [allComments, setAllComments] = useState([]);

  // likes state
  const [likes, setLikes] = useState([]);

  // has already liked post state
  const [hasLiked, setHasLiked] = useState(false);

  // handle like func.
  const handleLike = async (e) => {
    e.preventDefault();
    // if already liked a post
    // delete the like from DB
    if (hasLiked) {
      await deleteDoc(
        doc(db, "Users", data?.uid, "Posts", data?.id, "Likes", userInfo?.uid)
      );
    } else {
      // else like the post in DB
      await setDoc(
        doc(db, "Users", data?.uid, "Posts", data?.id, "Likes", userInfo?.uid),
        {
          likedPersonUsername: userInfo?.username,
        }
      );
    }
  };

  // subscribe to comment collection of a specific post so that we render comment
  // as soon as someone post a comment
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "Users", data?.uid, "Posts", data?.id, "Comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => {
          const temp = [];
          snapshot.docs.forEach((document) => {
            temp.push({ ...document.data(), id: document.id });
          });

          setAllComments(temp);
        },
        (err) => {
          console.log(err);
        }
      ),
    []
  );

  useEffect(
    () =>
      onSnapshot(
        collection(db, "Users", data?.uid, "Posts", data?.id, "Likes"),
        (snapshot) => {
          const temp = [];
          snapshot.docs.forEach((document) => {
            temp.push({ ...document.data(), id: document.id });
          });

          setLikes(temp);
        },
        (err) => {
          console.log(err);
        }
      ),
    []
  );

  //checking whther we have like a post or not
  useEffect(() => {
    setHasLiked(likes?.findIndex((like) => like.id === userInfo?.uid) !== -1);
  }, [likes]);

  return (
    <div className="flex flex-col bg-white my-7 border rounded-md shadow-sm">
      {/* header of post card */}
      <div className="flex justify-between items-center px-4 py-5">
        <div className="flex items-center flex-1 space-x-2">
          {data?.userImage ? (
            <img
              src={data?.userImage}
              alt="profile-pic-user"
              className="h-12 w-12 rounded-full p-1 border"
            />
          ) : (
            <UserCircleIcon className="h-7 rounded-full cursor-pointer" />
          )}
          <span className="font-bold text-sm">{data?.username}</span>
        </div>

        <EllipsisHorizontalIcon className="h-5 w-4" />
      </div>

      {/* image */}
      <div className="h-96 w-full relative">
        {/* post image */}
        <img
          onLoadStart={() => setPostLoading(true)}
          onLoadCapture={() => setPostLoading(false)}
          onError={() => setPostLoadError(false)}
          src={data?.postImage}
          alt="post"
          className="h-96 object-contain w-full"
        />

        {postLoadError && (
          <span className="absolute top-[40%] right-[35%] sm:right-[42%] font-bold text-sm text-red-600">
            Error, Please refresh the page
          </span>
        )}
        {postLoading && (
          <span className="absolute top-[40%] right-[35%] sm:right-[42%] font-bold text-lg sm:text-xl text-gray-800">
            Post is loading
          </span>
        )}
      </div>

      {/* icons */}
      <div className="flex items-center justify-between space-x-2 px-4 pt-4">
        <div className="flex items-center space-x-4">
          {hasLiked ? (
            <FilledHeart
              className="postIcon !text-red-500"
              onClick={handleLike}
            />
          ) : (
            <HeartIcon className="postIcon" onClick={handleLike} />
          )}
          <ChatBubbleOvalLeftEllipsisIcon className="postIcon" />
          <PaperAirplaneIcon className="postIcon" />
        </div>

        <BookmarkIcon className="postIcon" />
      </div>

      {/* caption and likes */}
      <p className="p-5 truncate">
        {likes.length > 0 && (
          <p className="text-lg font-bold text-black">
            <span className="text-blue-600 mr-2">{likes.length}</span>
            likes
          </p>
        )}
        <span className="font-bold mr-2">{data?.username}</span>
        {data?.caption}
      </p>

      {/* comments */}
      <ShowComments allComments={allComments} />

      {/* input comment section */}
      <InputCommentForm userInfo={userInfo} data={data} />
    </div>
  );
};

export default PostCard;
