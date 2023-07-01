import { UserCircleIcon } from "@heroicons/react/24/outline";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import { UserContext, UserContextType } from "../../../context/user";
import { CommonState } from "../../../../typings";
import { BSTContext } from "../../../context/SearchPost";

type MiniProfileProps = {
  userInfo: CommonState;
};

// Mini Profile Component
const MiniProfile = ({ userInfo }: MiniProfileProps) => {
  // bst context
  const { updateSearchTerm, updateSearchResult } = useContext(BSTContext);
  // signout func. from context
  const { signout } = useContext<UserContextType>(UserContext);
  // navigate state
  const navigate = useNavigate();
  // handle signout click
  const handleSignout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // sign out from firebase
    signOut(auth).then(() => {
      // clear user's info from context
      signout();
      updateSearchTerm("");
      updateSearchResult([]);
      // navigate to home
      navigate("/login");
    });
  };

  return (
    <div className="flex items-center justify-between mt-12 ml-5 w-full space-x-2">
      {/* clicking on image and name and bio takes us to account page */}
      <div
        className="flex space-x-2 items-center cursor-pointer"
        onClick={() => navigate("/account")}
      >
        {/* check whether user has a valid image or not */}
        {userInfo?.userImage ? (
          <img
            src={userInfo.userImage}
            alt="profile"
            className="h-14 w-14 rounded-full cursor-pointer object-cover"
          />
        ) : (
          <UserCircleIcon className="h-14 rounded-full cursor-pointer" />
        )}
        {/* username and status */}
        <div className="flex flex-col items-start flex-1">
          <h2 className="font-bold text-[14px]">{userInfo?.username}</h2>
          <h3 className="text-sm text-gray-500 truncate">{userInfo?.status}</h3>
        </div>
      </div>
      {/* signout button */}
      <button
        className="text-blue-400 font-medium text-sm"
        onClick={handleSignout}
      >
        sign out
      </button>
    </div>
  );
};

export default MiniProfile;
