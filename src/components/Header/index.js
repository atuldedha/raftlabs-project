import React, { useContext } from "react";
import {
  Bars3Icon,
  HeartIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PlusCircleIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/solid";
import { UserContext } from "../../context/user";
import { useNavigate } from "react-router-dom";
import { ModalContext } from "../../context/UploadPostModal";

// header component
const Header = () => {
  // user context
  const {
    state: { userInfo },
  } = useContext(UserContext);

  // open modal state from context
  const { openModal } = useContext(ModalContext);
  // navigate state
  const navigate = useNavigate();
  // handle navigation
  const handleNavigation = (e) => {
    e.preventDefault();
    navigate("/account");
  };
  return (
    <div className="mt-1 justify-center shadow-sm border-b bg-white z-10 sticky top-0">
      <div className="flex items-center justify-between bg-white max-w-6xl mx-4 lg:mx-auto py-2">
        {/* logo */}
        <div className="basis-1/4">
          {/* desktop logo */}
          <div className="hidden lg:inline w-24">
            <img
              src="https://links.papareact.com/ocw"
              alt="icon"
              className="w-24 object-contain"
            />
          </div>
          {/* mobile logo */}
          <div className="inline lg:hidden w-7 h-7 flex-shrink-0">
            <img
              src="https://links.papareact.com/jjm"
              alt="icon"
              className="w-7 h-7 object-contain"
            />
          </div>
        </div>

        {/* search */}

        <div className="relative bg-white rounded-md max-w-xs basis-1/2">
          <div className="absolute inset-y-0 flex items-center pointer-events-none pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            placeholder="search"
            className="bg-gray-50 block w-full pl-10 sm:text-sm border border-gray-300 focus:ring-black focus:border-black outline-none rounded-md py-2"
          />
        </div>

        {/*right icons  */}
        <div className="flex items-center justify-end space-x-4 basis-1/4">
          <HomeIcon className="headerIcons" onClick={() => navigate("/")} />
          <Bars3Icon className="h-6 md:hidden cursor-pointer" />
          <div className="relative headerIcons">
            <PaperAirplaneIcon className="headerIcons -rotate-45" />
            <div className="absolute -top-1 -right-3 text-xs w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse text-white">
              3
            </div>
          </div>

          {/* icon to open add post modal */}
          <PlusCircleIcon
            className="headerIcons "
            onClick={() => openModal()}
          />
          <UserGroupIcon className="headerIcons " />
          <HeartIcon className="headerIcons " />

          {/* profile photo or icon */}
          <div onClick={handleNavigation}>
            {Object.keys(userInfo).length ? (
              userInfo?.userImage ? (
                <img
                  src={userInfo?.userImage}
                  alt="profile"
                  className="h-8 w-8 rounded-full cursor-pointer object-cover"
                />
              ) : (
                <UserCircleIcon className="h-8 rounded-full cursor-pointer" />
              )
            ) : (
              <UserCircleIcon className="h-8 rounded-full cursor-pointer" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
