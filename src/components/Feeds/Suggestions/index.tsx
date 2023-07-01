import React, { useContext, useEffect, useState } from "react";
import {
  collection,
  query,
  getDocs,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { UserContext } from "../../../context/user";
import SuggestionCard from "./SuggestionCard/SuggestionCard";
import { CommonState } from "../../../../typings";

const Suggestions = () => {
  const {
    state: { userInfo },
    updateUser,
  } = useContext(UserContext);
  const [suggestions, setSuggestions] = useState<Array<CommonState>>([]);
  const [following, setFollowing] = useState<Array<CommonState>>([]);

  useEffect(() => {
    const unSub = onSnapshot(
      collection(db, "Users"),
      (snapshots) => {
        const temp: Array<CommonState> = [];
        snapshots.docs.forEach((document) => {
          temp.push({
            uid: document.id,
            username: document.data()?.username,
            userImage: document.data()?.userImage || "",
            following: document.data()?.following || [],
            followers: document.data()?.followers || [],
            status: document.data()?.status || "",
            ...document.data(),
          });
        });
        setSuggestions(temp);
      },
      (err) => {
        console.log(err);
      }
    );
    return () => unSub();
  }, []);

  // handler func. follow button click
  const handleFollowButtonClick = async (
    currentUid: string,
    followPersonInfo: CommonState,
    isFollowing: boolean
  ) => {
    // if already following: unfollow the user
    // remove from users following and
    // other person's followers list
    if (isFollowing) {
      await deleteDoc(
        doc(db, "Users", currentUid, "Following", followPersonInfo?.uid)
      );

      await deleteDoc(
        doc(db, "Users", followPersonInfo?.uid, "Followers", currentUid)
      );
    } else {
      // else add following and followers list respectively
      await setDoc(
        doc(db, "Users", currentUid, "Following", followPersonInfo?.uid),
        { ...followPersonInfo }
      );

      await setDoc(
        doc(db, "Users", followPersonInfo?.uid, "Followers", currentUid),
        { ...userInfo }
      );
    }
  };

  // subscribe to following collection of logged in user
  useEffect(() => {
    if (Object.keys(userInfo).length > 0) {
      const unsub = onSnapshot(
        collection(db, "Users", userInfo?.uid, "Following"),
        (documents) => {
          const tempfollowing: Array<CommonState> = [];
          documents?.docs.forEach((document) => {
            tempfollowing.push({
              uid: document.id,
              username: document.data()?.username,
              userImage: document.data()?.userImage || "",
              following: document.data()?.following || [],
              followers: document.data()?.followers || [],
              status: document.data()?.status || "",
              ...document.data(),
            });
          });
          // updating context and state
          setFollowing(tempfollowing);
          updateUser({
            ...userInfo,
            following: tempfollowing,
          });
        },
        (error) => {
          console.log(error);
        }
      );

      // unsubscribing to the collection when unmounts
      return () => {
        unsub();
      };
    }
  }, []);

  return (
    <div className="flex flex-col mt-2 ml-5 w-full h-[480px] overflow-y-auto overflow-x-hidden px-4 scrollbar-thin scrollbar-thumb-black/40 shadow-lg">
      <div className="flex justify-between mb-2 mt-6">
        <h3 className="font-bold text-sm text-gray-400">Suggestions</h3>
        <button className="font-semibold text-sm text-gray-700">see all</button>
      </div>
      {suggestions?.map((item) => (
        // item.uid !== userInfo?.uid &&
        // suggestion card component
        <SuggestionCard
          following={following}
          handleFollowButtonClick={handleFollowButtonClick}
          item={item}
          userInfo={userInfo}
          key={item.uid}
        />
      ))}
    </div>
  );
};

export default Suggestions;
