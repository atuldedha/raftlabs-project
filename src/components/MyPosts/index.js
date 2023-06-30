import React, { useState } from "react";

const MyPosts = ({ myPosts }) => {
  // loading state for posts
  const [postLoading, setPostLoading] = useState(true);
  // post load error state
  const [postLoadError, setPostLoadError] = useState(false);

  return (
    <div className="flex flex-col w-1/2 mt-10 space-y-4">
      {myPosts?.length > 0 && (
        <p className="font-bold text-xl">{myPosts?.length} Posts</p>
      )}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {myPosts?.map((post) => (
          <div
            className="h-full w-full relative bg-white rounded-md px-4 py-3 shadow-md"
            key={post.id}
          >
            <img
              onLoadStart={() => setPostLoading(true)}
              onLoadCapture={() => setPostLoading(false)}
              onError={() => setPostLoadError(false)}
              src={post?.postImage}
              alt="post"
              className="h-72 object-contain w-full"
            />

            {postLoadError && (
              <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-senter">
                <span className=" w-full text-center absolute font-bold text-sm text-red-600">
                  Error, Please refresh the page
                </span>
              </div>
            )}
            {postLoading && (
              <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-senter">
                <span className="w-full text-center absolute font-bold text-sm sm:text-base text-gray-800">
                  Post is loading
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPosts;
