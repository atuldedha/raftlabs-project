import React, { useEffect, useState } from "react";
import PostCard from "./PostCard/PostCard";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
// import { SearchPersonNode, insertNode } from "../../../utils/SearchPost";

// Posts Component
const Posts = ({ userInfo }) => {
  // all posts state
  const [allPosts, setAllPosts] = useState([]);
  // my posts state
  const [myPosts, setMyPosts] = useState([]);
  // following person's posts state
  const [followingPosts, setFollowingPosts] = useState([]);
  // unsubscribe array func. var
  const unSubscribeFunc = [];

  // const [bst, setBST] = useState < SearchPersonNode> {};

  // effect  to subscribe to change in posts of currently logged in user
  // and user following
  useEffect(() => {
    // check whther user exists or not
    if (Object.keys(userInfo).length > 0) {
      // subscribe to my posts collection
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

      // if not following anybody don't subscribe
      if (userInfo?.following?.length === 0 || !userInfo?.following) {
        setFollowingPosts([]);
      } else {
        // subscribing following person's posts collection
        userInfo?.following?.map((person) => {
          const docUnsub = onSnapshot(
            collection(db, "Users", person?.uid, "Posts"),
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
                setFollowingPosts(temp);
              });
            },
            (error) => {
              console.log(error);
            }
          );
          // pushing all the subscriptions for posts to unsubscribe func. var to unsub. when unmounts the app
          unSubscribeFunc.push(docUnsub);
        });
      }

      // unsubscribing all
      return () => {
        unSub1();
        unSubscribeFunc.forEach((unsubscribe) => unsubscribe());
      };
    }
  }, [userInfo]);

  // effect to merge all the posts in one state order by date
  useEffect(() => {
    // console.log(followingPosts);

    // combined array state and sorting
    const combinedArray = [...myPosts, ...followingPosts];
    combinedArray.sort((a, b) => b.timestamp - a.timestamp);

    // testing
    // const temp = [];
    // combinedArray.forEach((item) => {
    // temp.push(insertNode(bst, item));
    // });

    // console.log(temp);

    // setting all posts
    setAllPosts([...combinedArray]);
  }, [followingPosts, myPosts]);

  // console.log(userInfo);
  return (
    <div>
      {/* custom component to render post */}
      {allPosts?.map((data) => (
        <PostCard userInfo={userInfo} data={data} key={data.id} />
      ))}
    </div>
  );
};

export default Posts;
