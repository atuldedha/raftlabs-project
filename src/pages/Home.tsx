import React, { useContext, useEffect } from "react";
import Feeds from "../components/Feeds";
import Modal from "../components/Modal";
import { UserContext } from "../context/user";
import { useNavigate } from "react-router-dom";
import { ModalContext } from "../context/UploadPostModal";

// home page
const Home = () => {
  // user context
  const {
    state: { userInfo },
    updateUserInfoFromLocalStorage,
  } = useContext(UserContext);

  // modal context
  const {
    state: { modalState },
    closeModal,
  } = useContext(ModalContext);

  // navigate state
  const navigate = useNavigate();

  // effect to set user if exists on local storage
  // if not send back to login
  useEffect(() => {
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

  return (
    <div>
      {/* feeds section */}
      <section>
        <Feeds />
      </section>
      {/* modal state for uploading posts */}
      <Modal
        closeModal={() => closeModal()}
        open={modalState}
        userInfo={userInfo}
      />
    </div>
  );
};

export default Home;
