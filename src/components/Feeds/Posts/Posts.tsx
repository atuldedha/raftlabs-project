import React, { useContext, useEffect, useState } from "react";
import PostCard from "./PostCard/PostCard";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import { CommonState, PostsState } from "../../../../typings";
import { SearchPersonNode, insertNode } from "../../../utils/SearchPost";
import { BSTContext } from "../../../context/SearchPost";

type PostsProps = {
  userInfo: CommonState;
};

// Posts Component
const Posts = ({ userInfo }: PostsProps) => {
  // bst context
  const {
    state: { searchTerm, searchResults },
    addPostsToBst,
  } = useContext(BSTContext);
  // all posts state
  const [allPosts, setAllPosts] = useState<Array<PostsState>>([]);
  // my posts state
  const [myPosts, setMyPosts] = useState<Array<PostsState>>([]);
  // following person's posts state
  const [followingPosts, setFollowingPosts] = useState<Array<PostsState>>([]);
  // unsubscribe array func. var
  const unSubscribeFunc: any = [];

  // effect  to subscribe to change in posts of currently logged in user
  // and user following
  useEffect(() => {
    // check whther user exists or not
    if (Object.keys(userInfo).length > 0) {
      // subscribe to my posts collection
      const unSub1 = onSnapshot(
        collection(db, "Users", userInfo?.uid, "Posts"),
        (snapshot) => {
          const temp: Array<PostsState> = [];
          snapshot.docs.forEach((document) => {
            if (document.data()) {
              temp.push({
                ...document.data(),
                timestamp: document.data()?.timestamp,
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

      // if not following anybody don't subscribe
      if (userInfo?.following?.length === 0 || !userInfo?.following) {
        setFollowingPosts([]);
      } else {
        // subscribing following person's posts collection
        // const allFollowingPosts: Array<PostsState> = []
        const temp: Array<PostsState> = [];
        userInfo?.following?.forEach((person: any) => {
          const docUnsub = onSnapshot(
            collection(db, "Users", person?.uid, "Posts"),
            (snapshot) => {
              snapshot.docs.forEach((document) => {
                if (document.data()) {
                  temp.push({
                    ...document.data(),
                    timestamp: document.data()?.timestamp,
                    id: document.id,
                    caption: document.data()?.caption,
                    postImage: document.data()?.postImage,
                    uid: document.data()?.uid,
                    username: document.data()?.username,
                    userImage: document.data()?.userImage,
                  });
                }
              });
            },
            (error) => {
              console.log(error);
            }
          );
          // pushing all the subscriptions for posts to unsubscribe func. var to unsub. when unmounts the app
          unSubscribeFunc.push(docUnsub);
        });

        setFollowingPosts(temp);
      }

      // unsubscribing all
      return () => {
        unSub1();
        unSubscribeFunc.forEach((unsubscribe: () => any) => unsubscribe());
      };
    }
  }, [userInfo]);

  // effect to merge all the posts in one state order by date
  useEffect(() => {
    // combined array state and sorting
    const combinedArray = [...myPosts, ...followingPosts];
    combinedArray.sort(
      (a, b) => b?.timestamp?.toMillis() - a?.timestamp?.toMillis()
    );

    // adding posts to bst tree
    let temp: SearchPersonNode | null = null;
    combinedArray.forEach((item) => {
      temp = insertNode(temp, {
        id: item?.id,
        timestamp: item?.timestamp,
        caption: item?.caption,
        postImage: item?.postImage,
        username: item?.username,
        userImage: item?.userImage,
        uid: item?.uid,
      });
    });

    // calling context to save all posts to bst tree
    addPostsToBst(temp);

    // setting all posts
    setAllPosts([...combinedArray]);
  }, [followingPosts, myPosts, searchTerm]);

  // console.log(allPosts, searchResults);

  return (
    <div>
      {/* if search term is there render the search results */}
      {searchTerm.length > 0 ? (
        searchResults?.length > 0 ? (
          searchResults?.map((data: PostsState) => (
            <>
              {console.log("hello")}
              {/* //  custom component to render post */}
              <PostCard userInfo={userInfo} data={data} key={data.id} />
            </>
          ))
        ) : (
          <span>No Result Found</span>
        )
      ) : (
        // else show all posts
        allPosts?.map((data) => (
          <PostCard userInfo={userInfo} data={data} key={data.id} />
        ))
      )}
    </div>
  );
};

export default Posts;
