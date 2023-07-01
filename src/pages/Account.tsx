import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AccountInfo from "../components/AccountInfo";
import MyPosts from "../components/MyPosts";
import { PostsState } from "../../typings";

// user account page
const Account = () => {
  // context state and update user func.
  const {
    state: { userInfo },
    updateUserInfoFromLocalStorage,
    updateUser,
  } = useContext(UserContext);

  // navigate state
  const navigate = useNavigate();

  // my posts state
  const [myPosts, setMyPosts] = useState<Array<PostsState>>([]);

  // to check whether user exists on local storage or not
  // if not send back to login
  useEffect(() => {
    // user not found anywhere
    const userInfoString = localStorage.getItem("userInfo");
    const userInfoConverted = userInfoString ? JSON.parse(userInfoString) : {};
    // send to login if user not exists anywhere
    if (
      !Object.keys(userInfo).length &&
      (!userInfoConverted || !Object.keys(userInfoConverted)?.length)
    ) {
      navigate("/login");
    }

    // update context if user exists on local storage
    if (!Object.keys(userInfo).length && userInfoConverted) {
      updateUserInfoFromLocalStorage(userInfoConverted?.userInfo);
    }
  }, []);

  // attaching a listener to Users Posts collection to render posts immediatly after upload
  useEffect(() => {
    // to attach first checking user exists or not
    if (Object.keys(userInfo).length) {
      const unSub1 = onSnapshot(
        collection(db, "Users", userInfo?.uid, "Posts"),
        (snapshot) => {
          const temp: Array<PostsState> = [];
          snapshot.docs.forEach((document) => {
            if (document.data()) {
              temp.push({
                ...document.data(),
                timestamp: document.data()?.timestamp?.toMillis(),
                id: document.id,
                caption: document.data()?.caption,
                postImage: document.data()?.postImage,
                uid: document.data()?.uid,
                username: document.data()?.username,
                userImage: document.data()?.userImage,
              });
            }
          });
          setMyPosts(temp);
        },
        (error) => {
          console.log(error);
        }
      );

      return () => {
        unSub1();
      };
    }
  }, [userInfo]);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-5">
      {/* component to show user info */}
      <AccountInfo userInfo={userInfo} updateUser={updateUser} />

      {/* custom component to render my posts */}
      <MyPosts myPosts={myPosts} />
    </div>
  );
};

export default Account;
