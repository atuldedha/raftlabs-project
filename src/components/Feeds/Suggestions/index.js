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

const Suggestions = () => {
  const {
    state: { userInfo },
    updateUser,
  } = useContext(UserContext);
  const [suggestions, setSuggestions] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      const queryString = query(collection(db, "Users"));
      getDocs(queryString)
        .then((querySnapshot) => {
          const temp = [];
          querySnapshot.docs.forEach((document) => {
            temp.push({ ...document.data(), uid: document.id });
          });

          setSuggestions(temp);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchSuggestedUsers();
  }, []);

  // handler func. follow button click
  const handleFollowButtonClick = async (
    currentUid,
    followPersonInfo,
    isFollowing
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
          const tempfollowing = [];
          documents?.docs.forEach((document) => {
            tempfollowing.push({ ...document?.data() });
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
    <div className="flex flex-col ml-5 w-full">
      <div className="flex justify-between mb-2 mt-6">
        <h3 className="font-bold text-sm text-gray-400">Suggestions</h3>
        <button className="font-semibold text-sm text-gray-700">see all</button>
      </div>
      {suggestions?.map(
        (item) =>
          item.uid !== userInfo?.uid && (
            // suggestion card component
            <SuggestionCard
              following={following}
              handleFollowButtonClick={handleFollowButtonClick}
              item={item}
              userInfo={userInfo}
              key={item.uid}
            />
          )
      )}
    </div>
  );
};

export default Suggestions;
