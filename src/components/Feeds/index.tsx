import React, { useContext } from "react";
import Posts from "./Posts/Posts";
import MiniProfile from "./MiniProfile";
import Suggestions from "./Suggestions";
import { UserContext } from "../../context/user";

// feeds component
const Feeds = () => {
  // user context
  const {
    state: { userInfo },
  } = useContext(UserContext);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-6xl mx-auto px-4">
      {/* if user exists render the application */}
      {Object.keys(userInfo).length ? (
        <>
          {/* left part of feed */}
          <section className="col-span-2">
            {/* custom posts component to render posts of loggedin user and users we follow */}
            <Posts userInfo={userInfo} />
          </section>
          {/* right part of feed */}
          <section className="hidden xl:inline-grid md:col-span-1">
            <div className="fixed top-24 w-80 h-full overflow-y-auto overflow-x-hidden">
              {/* mini profile section  */}
              <MiniProfile userInfo={userInfo} />
              {/* component for suggestions */}
              <Suggestions />
            </div>
          </section>
        </>
      ) : (
        // else show message to login
        <span className="flex items-center justify-center font-bold">
          Please Login to access the application
        </span>
      )}
    </div>
  );
};

export default Feeds;
