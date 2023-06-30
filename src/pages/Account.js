import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AccountInfo from "../components/AccountInfo";
import MyPosts from "../components/MyPosts";

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
  const [myPosts, setMyPosts] = useState([]);

  // to check whether user exists on local storage or not
  // if not send back to login
  useEffect(() => {
    // user not found anywhere
    if (
      !Object.keys(userInfo).length &&
      (!JSON.parse(localStorage.getItem("userInfo")) ||
        !Object.keys(JSON.parse(localStorage.getItem("userInfo"))).length)
    ) {
      navigate("/login");
    }

    // not in context but present in localstorage
    if (
      !Object.keys(userInfo).length &&
      JSON.parse(localStorage.getItem("userInfo"))
    ) {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      console.log(user?.userInfo);
      updateUserInfoFromLocalStorage(user?.userInfo);
    }
  }, []);

  // attaching a listener to Users Posts collection to render posts immediatly after upload
  useEffect(() => {
    // to attach first checking user exists or not
    if (Object.keys(userInfo).length) {
      const unSub1 = onSnapshot(
        collection(db, "Users", userInfo?.uid, "Posts"),
        (snapshot) => {
          const temp = [];
          snapshot.docs.forEach((document) => {
            if (document.data()) {
              temp.push({
                ...document.data(),
                timestamp: document.data()?.timestamp?.toMillis(),
                id: document.id,
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
    <div className="flex flex-col items-center justify-center">
      {/* component to show user info */}
      <AccountInfo userInfo={userInfo} updateUser={updateUser} />

      {/* custom component to render my posts */}
      <MyPosts myPosts={myPosts} />
    </div>
  );
};

export default Account;
